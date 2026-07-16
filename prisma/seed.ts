import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@iqrarchillervan.com" },
    update: {},
    create: {
      email: "admin@iqrarchillervan.com",
      passwordHash,
      name: "Iqrar Admin",
      role: "OWNER",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "Iqrar Chiller Van Transport LLC",
      phone: "+971 5X XXXXXXX",
      whatsapp: "+971 5X XXXXXXX",
      email: "info@iqrarchillervan.com",
      address: "Dubai, UAE",
      heroHeadline: "Reliable Chiller Van Transport Across the UAE",
      heroSubtext:
        "Temperature-controlled vans and trucks for food, pharma, and perishable goods — 24/7 across Dubai, Abu Dhabi, and Sharjah.",
    },
  });

  const category = await prisma.blogCategory.upsert({
    where: { slug: "cold-chain-uae" },
    update: {},
    create: { name: "Cold Chain UAE", slug: "cold-chain-uae" },
  });

  const vehicles = [
    {
      name: "Chiller Van",
      slug: "chiller-van",
      models: "Toyota Hiace, Nissan Urvan",
      tempMin: 0,
      tempMax: 5,
      icon: "🚚",
      description:
        "Reliable chiller van rentals for transporting perishable goods like fresh food, medicine, and flowers.",
      idealFor: "Fresh food, Beverages, Catering",
      order: 1,
    },
    {
      name: "Chiller Truck",
      slug: "chiller-truck",
      models: "Mitsubishi Canter, Isuzu",
      tempMin: 0,
      tempMax: 5,
      icon: "🚛",
      description:
        "Chiller truck rentals for secure, temperature-controlled bulk transport.",
      idealFor: "Large-scale food distribution, Event catering",
      order: 2,
    },
    {
      name: "Freezer Van",
      slug: "freezer-van",
      models: "Hyundai H1, Mercedes Sprinter",
      tempMin: -25,
      tempMax: -18,
      icon: "❄️",
      description:
        "Deep-freeze rentals built for frozen goods, ice cream, and seafood.",
      idealFor: "Frozen goods, Ice cream, Seafood",
      order: 3,
    },
    {
      name: "Refrigerated Van",
      slug: "refrigerated-van",
      models: "Ford Transit, Renault Master",
      tempMin: -18,
      tempMax: 5,
      icon: "🧊",
      description:
        "Precise refrigeration for medical supplies, dairy products, and bakery items.",
      idealFor: "Medical supplies, Dairy, Bakery",
      order: 4,
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicleType.upsert({
      where: { slug: v.slug },
      update: {},
      create: v,
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "welcome-to-iqrar-chiller-van-transport" },
    update: {},
    create: {
      title: "Welcome to Iqrar Chiller Van Transport",
      slug: "welcome-to-iqrar-chiller-van-transport",
      excerpt: "Introducing our temperature-controlled fleet across the UAE.",
      body: "Replace this with your real launch post content.",
      status: "DRAFT",
      categoryId: category.id,
    },
  });

  console.log("Seed complete. Admin login: admin@iqrarchillervan.com / ChangeMe123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
