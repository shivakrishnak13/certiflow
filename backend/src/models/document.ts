import { DOCUMENT_TYPE } from "@/types/enums/enums";
import mongoose, { Document } from "mongoose";

interface IDocument {
  _id: mongoose.Types.ObjectId;

  userId: mongoose.Types.ObjectId;

  applicationId: mongoose.Types.ObjectId;

  type: DOCUMENT_TYPE;

  originalName: string;

  s3Key: string;

  size: number;

  mimeType: string;
  version: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IDocumentDocument extends Document, IDocument {
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new mongoose.Schema<IDocumentDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(DOCUMENT_TYPE),
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

DocumentSchema.index(
  {
    applicationId: 1,
    type: 1,
  },
  {
    unique: true,
  },
);

export const UserDocument = mongoose.model<IDocumentDocument>(
  "UserDocument",
  DocumentSchema,
);
