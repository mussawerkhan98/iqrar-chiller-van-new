import Link from "next/link";

type Settings = {
  siteName: string;
  logoUrl: string | null;
  phone: string;
  email: string;
  address: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
};

export default function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <footer className="bg-frost-900 text-frost-100/70 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <p className="font-display font-bold text-white text-lg mb-2">{settings.siteName}</p>
          <p className="text-sm">{settings.address}</p>
        </div>

        <div>
          <p className="text-white font-medium mb-2 text-sm">Contact</p>
          <p className="text-sm">{settings.phone}</p>
          <p className="text-sm">{settings.email}</p>
        </div>

        <div>
          <p className="text-white font-medium mb-2 text-sm">Quick Links</p>
          <div className="flex flex-col gap-1 text-sm">
            <Link href="/services" className="hover:text-white">Services</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-frost-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs">
          <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
          <div className="flex gap-4">
            {settings.facebookUrl && <a href={settings.facebookUrl} className="hover:text-white">Facebook</a>}
            {settings.instagramUrl && <a href={settings.instagramUrl} className="hover:text-white">Instagram</a>}
            {settings.linkedinUrl && <a href={settings.linkedinUrl} className="hover:text-white">LinkedIn</a>}
          </div>
        </div>
      </div>
    </footer>
  );
}
