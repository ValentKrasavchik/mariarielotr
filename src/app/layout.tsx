import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Мария Риелтор - недвижимость в Донецке и Донецкой области",
    template: "%s | Мария Риелтор",
  },
  description:
    "Личный сайт риелтора Марии: актуальные объекты, сопровождение покупки и продажи недвижимости, консультации по рынку.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "Мария Риелтор",
    title: "Мария Риелтор - недвижимость в Донецке и Донецкой области",
    description:
      "Лично помогаю с покупкой, продажей и подбором недвижимости в Донецке и Донецкой области.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full scroll-smooth">
      <body className="site-body min-h-full bg-graphite text-cream antialiased">
        <div aria-hidden className="site-bg" />
        <div className="relative z-10 min-h-full">{children}</div>
      </body>
    </html>
  );
}
