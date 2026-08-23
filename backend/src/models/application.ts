import { APPLICATION_STATUS } from "@/types/enums/enums";
import mongoose, { Document } from "mongoose";

interface IApplication {
  userId: mongoose.Types.ObjectId;

  referenceNumber: string;

  applicant: {
    fullName: string;
    dateOfBirth: Date;
    registrationNumber: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
    };
  };

  status: APPLICATION_STATUS;
  certificate: {
    s3Key: string;
    generatedAt: Date;
  };

  submittedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface IApplicationDocument extends Document, IApplication {
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new mongoose.Schema<IApplicationDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referenceNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    applicant: {
      fullName: {
        type: String,
      },
      dateOfBirth: {
        type: Date,
      },
      registrationNumber: {
        type: String,
      },
      address: {
        line1: {
          type: String,
        },
        line2: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        postalCode: {
          type: String,
        },
      },
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.DRAFT,
    },

    certificate: {
      s3Key: {
        type: String,
        required: false,
      },
      generatedAt: {
        type: Date,
        required: false,
      },
    },

    submittedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Application = mongoose.model<IApplicationDocument>(
  "Application",
  ApplicationSchema,
);
