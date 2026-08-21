import mongoose, { Document } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: {
    first: string;
    last: string;
  };
}

export interface IUserDocument extends Document, IUser {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
        required: true,
      },
    },
    password: {
      type: String,
      required: true,
      select: false, // Exclude password from query results by default
    },
  },
  {
    timestamps: true,
  },
);


export const User = mongoose.model<IUserDocument>("User", UserSchema);
