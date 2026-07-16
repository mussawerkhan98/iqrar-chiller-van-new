import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/site/ContactForm";

export default async function ContactPage() {
  const [settings, vehicles] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: "main" }, update: {}, create: { id: "main" } }),
    prisma.vehicleType.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display font-extrabold text-4xl text-frost-900 mb-3">Contact Us</h1>
      <p className="text-steel mb-12 max-w-xl">
        Tell us what you need moved and when — we'll confirm availability and pricing by phone.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-frost-50 rounded-2xl p-8">
          <ContactForm vehicles={vehicles.map((v) => ({ id: v.id, name: v.name }))} />
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-frost-900 mb-4">Reach us directly</h2>
          <div className="space-y-3 text-sm text-steel">
            <p>
              <span className="text-frost-900 font-medium">Phone: </span>
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-frost-600">
                {settings.phone}
              </a>
            </p>
            <p>
              <span className="text-frost-900 font-medium">WhatsApp: </span>
              {settings.whatsapp}
            </p>
            <p>
              <span className="text-frost-900 font-medium">Email: </span>
              <a href={`mailto:${settings.email}`} className="hover:text-frost-600">
                {settings.email}
              </a>
            </p>
            <p>
              <span className="text-frost-900 font-medium">Office: </span>
              {settings.address}
            </p>
            <p className="text-amber-600 font-medium pt-2">Available 24/7</p>
          </div>
        </div>
      </div>
    </main>
  );
}
