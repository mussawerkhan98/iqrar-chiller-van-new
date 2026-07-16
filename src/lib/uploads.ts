import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Object storage for uploads (logo, fleet photos, blog covers, team photos).
// Works with Cloudflare R2 or AWS S3 — both speak the same S3 API, just
// point S3_ENDPOINT at R2 (or leave unset for real AWS S3).
//
// This replaces writing to local disk: on Hostinger's managed Node.js
// hosting the filesystem isn't guaranteed to persist across redeploys,
// so files must live somewhere external.

const s3 = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT || undefined, // e.g. https://<account_id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET!;
// Public base URL to prefix uploaded object keys with, e.g.:
//   R2: https://pub-xxxxxxxx.r2.dev  (or your custom domain bound to the bucket)
//   S3: https://<bucket>.s3.<region>.amazonaws.com
const PUBLIC_URL_BASE = process.env.S3_PUBLIC_URL_BASE!;

export async function saveUploadedFile(file: File): Promise<{ url: string; filename: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const key = `uploads/${safeName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // R2 ignores ACL (public access is controlled at the bucket level);
      // harmless to include for S3 compatibility.
      ACL: "public-read",
    })
  );

  return { url: `${PUBLIC_URL_BASE}/${key}`, filename: safeName };
}
