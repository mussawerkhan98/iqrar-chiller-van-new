import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  return (
    <div className="bg-glacier text-frost-900 font-body">
      <SiteHeader settings={settings} />
      {children}
      <SiteFooter settings={settings} />
    </div>
  );
}
