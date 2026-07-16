import "./globals.css";
import { Archivo, Inter } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-archivo" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

export const metadata = {
  title: "Iqrar Chiller Van Transport LLC",
  description: "Reliable chiller van and refrigerated truck transport across the UAE, 24/7.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
