import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Sihan Wang | Content Strategy, Digital Products & Research",
  description:
    "A bilingual portfolio by Sihan Wang, spanning content strategy, digital products and research.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Sihan Wang | Content Strategy, Digital Products & Research",
    description:
      "A bilingual portfolio by Sihan Wang, spanning content strategy, digital products and research.",
    images: [{ url: "/og.png", width: 1733, height: 908, alt: "Sihan Wang portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sihan Wang | Content Strategy, Digital Products & Research",
    description:
      "A bilingual portfolio by Sihan Wang, spanning content strategy, digital products and research.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
