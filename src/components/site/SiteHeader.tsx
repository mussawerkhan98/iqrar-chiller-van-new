import Link from "next/link";

type Settings = {
  siteName: string;
  logoUrl: string | null;
  phone: string;
};

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ settings }: { settings: Settings }) {
  const telHref = `tel:${settings.phone.replace(/\s+/g, "")}`;

  return (
    <header className="sticky top-0 z-40 bg-frost-900/95 backdrop-blur border-b border-frost-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt={settings.siteName} className="h-9 w-auto" />
          ) : (
            <span className="font-display font-bold text-lg text-white tracking-tight">
              {settings.siteName}
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-frost-100/80 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={telHref}
          className="shrink-0 bg-amber-500 hover:bg-amber-600 text-frost-900 font-semibold text-sm px-4 py-2 rounded-full transition-colors"
        >
          Call {settings.phone}
        </a>
      </div>
    </header>
  );
}
