import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {
      siteName: body.siteName,
      logoUrl: body.logoUrl,
      phone: body.phone,
      whatsapp: body.whatsapp,
      email: body.email,
      address: body.address,
      facebookUrl: body.facebookUrl,
      instagramUrl: body.instagramUrl,
      linkedinUrl: body.linkedinUrl,
      heroHeadline: body.heroHeadline,
      heroSubtext: body.heroSubtext,
    },
    create: { id: "main", ...body },
  });

  return NextResponse.json(settings);
}
