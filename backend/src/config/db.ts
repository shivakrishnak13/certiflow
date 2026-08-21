import envConfig from "@/utils/configuration/environment";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.DB_PATH);
    console.log(`Connected to DB ${envConfig.DB_PATH}`);
  } catch (err) {
    console.log(`Error connecting to DB ${err}`);
  }
};
