import { Application } from "@/models/application";
import { UserDocument } from "@/models/document";
import { S3Service } from "@/services/s3.service";
import { APPLICATION_STATUS } from "@/types/enums/enums";
import { REQUIRED_DOCUMENT_TYPES } from "@/utils/constants";
import { generateCertificatePdf } from "@/utils/helpers/certificate";
import { getObjectId } from "@/utils/helpers/commonHelpers";
import { generateReferenceNumber } from "@/utils/helpers/referenceNumber";
import { ApplicationType, applicationSchema } from "@/utils/zod/application";

export class ApplicationService {
  static async createApplication(userId: string) {
    return Application.create({ userId });
  }
  static async getApplications(userId: string) {
    return Application.find({ userId })
      .sort({ createdAt: -1 })
      .select("-certificate.s3Key");
  }

  static async getApplicationById(applicationId: string, userId: string) {
    const results = await Application.aggregate([
      {
        $match: {
          _id: getObjectId(applicationId),
          userId: getObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userdocuments",
          let: { appId: "$_id", uId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$applicationId", "$$appId"] },
                    { $eq: ["$userId", "$$uId"] },
                  ],
                },
              },
            },

            {
              $project: {
                id: "$_id",
                _id: 0,
                type: 1,
                originalName: 1,
                size: 1,
              },
            },
          ],
          as: "documents",
        },
      },
    ]);

    if (!results || results.length === 0) {
      return null;
    }

    const applicationData = results[0];

    const { documents, ...application } = applicationData;

    return {
      application: {
        ...application,
        degree: application.applicant?.degree,
        specialization: application.applicant?.specialization,
        currentStep: application.currentStep,
      },
      documents,
    };
  }

  static async ApplicationType(
    applicationId: string,
    userId: string,
    data: ApplicationType,
  ) {
    return Application.findOneAndUpdate(
      {
        _id: applicationId,
        userId,
        status: APPLICATION_STATUS.DRAFT,
      },
      {
        $set: data,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  static async submitApplication(applicationId: string, userId: string) {
    const application = await Application.findOne({
      _id: applicationId,
      userId,
      status: APPLICATION_STATUS.DRAFT,
    });

    if (!application) {
      return null;
    }

    const applicant = application.applicant;
    const parsedData = applicationSchema.safeParse({ applicant });

    if (!parsedData.success) {
      throw new Error(`Invalid applicant data: ${parsedData.error.message}`);
    }

    const documents = await UserDocument.find({
      applicationId,
      userId,
    });

    // validate required documents
    const uploadedTypes = new Set(documents.map((document) => document.type));

    const missingDocuments = REQUIRED_DOCUMENT_TYPES.filter(
      (requiredType) => !uploadedTypes.has(requiredType),
    );

    if (missingDocuments.length > 0) {
      throw new Error(
        `Missing required documents: ${missingDocuments.join(", ")}`,
      );
    }

    // generate reference number
    const referenceNumber = generateReferenceNumber();
    console.log({ referenceNumber });

    // generate certificate PDF
    const certificateBuffer = await generateCertificatePdf({
      referenceNumber,
      fullName: applicant.fullName,
      degree: applicant.degree,
      specialization: applicant.specialization,
      dateOfBirth: applicant.dateOfBirth,
      registrationNumber: applicant.registrationNumber,
      address: applicant.address,
    });

    // upload certificate to S3
    const certificateS3Key = `applications/${applicationId}/certificate/${referenceNumber}.pdf`;

    try {
      await S3Service.uploadFile(
        certificateS3Key,
        certificateBuffer,
        "application/pdf",
      );

      const submittedApplication = await Application.findOneAndUpdate(
        {
          _id: applicationId,
          userId,
          status: APPLICATION_STATUS.DRAFT,
        },
        {
          $set: {
            status: APPLICATION_STATUS.SUBMITTED,
            currentStep: 3,
            referenceNumber,
            certificate: {
              s3Key: certificateS3Key,
              generatedAt: new Date(),
            },
            submittedAt: new Date(),
          },
        },
        {
          new: true,
        },
      );

      if (!submittedApplication) {
        await S3Service.deleteFile(certificateS3Key);

        throw new Error("Application could not be submitted.");
      }

      return {
        application: submittedApplication,
        referenceNumber,
      };
    } catch (error) {
      await S3Service.deleteFile(certificateS3Key).catch(() => undefined);
      throw error;
    }
  }

  static async getCertificateDownloadUrl(
    applicationId: string,
    userId: string,
  ) {
    const application = await Application.findOne({
      _id: applicationId,
      userId,
      status: APPLICATION_STATUS.SUBMITTED,
    }).lean();

    if (!application || !application.certificate.s3Key) {
      return null;
    }

    const url = await S3Service.getSignedDownloadUrl(
      application.certificate.s3Key,
    );

    return {
      url,
      fileName: `provisional-certificate-${application.referenceNumber}.pdf`,
    };
  }
}
