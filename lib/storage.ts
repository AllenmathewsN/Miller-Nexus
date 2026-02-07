import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function s3Client() {
  return new S3Client({
    region: required("AWS_REGION"),
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
      accessKeyId: required("AWS_ACCESS_KEY_ID"),
      secretAccessKey: required("AWS_SECRET_ACCESS_KEY"),
    } : undefined,
  });
}

export async function getPresignedPutUrl(storageKey: string, contentType: string) {
  const Bucket = required("S3_BUCKET");
  const client = s3Client();
  const cmd = new PutObjectCommand({
    Bucket,
    Key: storageKey,
    ContentType: contentType,
    ServerSideEncryption: process.env.S3_KMS_KEY_ID ? "aws:kms" : "AES256",
    SSEKMSKeyId: process.env.S3_KMS_KEY_ID || undefined,
  });
  return await getSignedUrl(client, cmd, { expiresIn: 60 * 10 });
}

export async function getPresignedGetUrl(storageKey: string) {
  const Bucket = required("S3_BUCKET");
  const client = s3Client();
  const cmd = new GetObjectCommand({ Bucket, Key: storageKey });
  return await getSignedUrl(client, cmd, { expiresIn: 60 * 5 });
}
