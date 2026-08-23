import { Application } from "@/models/application";
import { APPLICATION_STATUS, DOCUMENT_TYPE } from "@/types/enums/enums";
import { UpdateApplication } from "@/utils/zod/application";
import mongoose from "mongoose";
import { S3Service } from "@/services/s3.service";
import { UserDocument } from "@/models/document";
import path from "node:path";

export class ApplicationService {
  static async createApplication(userId: string) {
    return Application.create({ userId });
  }

  static async getApplications(userId: string) {
    return Application.find({ userId });
  }

  static async getApplicationById(id: string) {
    return Application.findById(id);
  }

  static async updateApplication(
    applicationId: string,
    userId: string,
    data: UpdateApplication,
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

    const documentId = new mongoose.Types.ObjectId();

    const s3Key = `applications/${applicationId}/documents/${documentId}.pdf`;
    try {
      await S3Service.uploadFile(s3Key, file.buffer, file.mimetype);
    } catch (error) {
      throw new Error('Something went wrong while uploading your file.')
    }

    return UserDocument.create({
      _id: documentId,
      userId,
      applicationId,
      type: documentType,
      originalName: path.basename(file.originalname).slice(0, 255),
      s3Key,
      size: file.size,
      mimeType: file.mimetype,
    });
  }
}
