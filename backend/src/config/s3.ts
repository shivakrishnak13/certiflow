import envConfig from "@/utils/configuration/environment";
import { S3Client } from "@aws-sdk/client-s3";

const region = envConfig.AWS_REGION;
const accessKeyId = envConfig.AWS_ACCESS_KEY_ID;
const secretAccessKey = envConfig.AWS_SECRET_ACCESS_KEY;

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const S3_BUCKET_NAME = envConfig.S3_BUCKET_NAME;
