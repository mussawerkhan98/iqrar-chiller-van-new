import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Called from the public site's contact form / "Book a Van" buttons.
// No auth required — this is the one write endpoint open to visitors.
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      message: body.message || null,
      vehicleTypeId: body.vehicleTypeId || null,
    },
  });

  return NextResponse.json({ ok: true, id: lead.id });
}
