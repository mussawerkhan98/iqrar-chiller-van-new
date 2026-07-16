import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/uploads";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)." }, { status: 400 });
  }

  const { url, filename } = await saveUploadedFile(file);

  const media = await prisma.media.create({
    data: { url, filename, altText: "" },
  });

  return NextResponse.json(media);
}
