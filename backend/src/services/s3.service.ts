import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME, s3Client } from "@/config/s3";

export class S3Service {
  static async uploadFile(key: string, buffer: Buffer, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    return {
      key,
      bucket: S3_BUCKET_NAME,
    };
  }

  static async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }
}
