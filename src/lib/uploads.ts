import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Local-disk uploads for dev/single-VPS deployments. On EC2/Hostinger this
// writes into /public/uploads which Nginx already serves as a static path.
// To move to S3 later: swap this function's body for a presigned PUT to S3
// and return the resulting object URL — nothing else in the app needs to change.

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveUploadedFile(file: File): Promise<{ url: string; filename: string }> {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = path.join(UPLOAD_DIR, safeName);

  await writeFile(filePath, buffer);

  return { url: `/uploads/${safeName}`, filename: safeName };
}
