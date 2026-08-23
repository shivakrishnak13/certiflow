import { Application } from "@/models/application";
import { UserDocument } from "@/models/document";
import { S3Service } from "@/services/s3.service";
import { APPLICATION_STATUS, DOCUMENT_TYPE } from "@/types/enums/enums";
import { REQUIRED_DOCUMENT_TYPES } from "@/utils/constants";
import mongoose from "mongoose";
import path from "node:path";

export class DocumentService {
  static async uploadDocument(
    applicationId: string,
    userId: string,
    documentType: DOCUMENT_TYPE,
    file: Express.Multer.File,
  ) {
    const application = await Application.findOne({
      _id: applicationId,
      userId,
      status: APPLICATION_STATUS.DRAFT,
    });

    if (!application) return null;

    const existingDocument = await UserDocument.findOne({
      applicationId,
      userId,
      type: documentType,
    });

    const documentId = existingDocument?._id ?? new mongoose.Types.ObjectId();

    const nextVersion = existingDocument ? existingDocument.version + 1 : 1;

    const s3Key = `applications/${applicationId}/documents/${documentId}/v${nextVersion}.pdf`;

    const oldS3Key = existingDocument?.s3Key;

    try {
      await S3Service.uploadFile(s3Key, file.buffer, file.mimetype);
    } catch (error) {
      throw new Error("Something went wrong while uploading your file.");
    }

    try {
      const document = await UserDocument.findOneAndUpdate(
        {
          applicationId,
          userId,
          type: documentType,
        },
        {
          $set: {
            s3Key,
            originalName: path.basename(file.originalname).slice(0, 255),
            size: file.size,
            mimeType: file.mimetype,
            version: nextVersion,
          },
          $setOnInsert: {
            _id: documentId,
            applicationId,
            userId,
            type: documentType,
          },
        },
        {
          new: true,
          upsert: true,
        },
      );

      // delete previous S3 object
      if (oldS3Key) {
        await S3Service.deleteFile(oldS3Key).catch(() => undefined);
      }

      const uploadedDocumentTypes = await UserDocument.distinct("type", {
        applicationId,
        userId,
      });

      const hasAllRequiredDocuments = REQUIRED_DOCUMENT_TYPES.every(
        (requiredType) => uploadedDocumentTypes.includes(requiredType),
      );

      if (hasAllRequiredDocuments) {
        await Application.updateOne(
          {
            _id: applicationId,
            userId,
            status: APPLICATION_STATUS.DRAFT,
          },
          {
            $set: {
              currentStep: 3,
            },
          },
        );
      }

      return document;
    } catch (error) {
      await S3Service.deleteFile(s3Key);
      throw error;
    }
  }
}
