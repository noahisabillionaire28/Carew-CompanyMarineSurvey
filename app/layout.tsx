import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { scrollToTopScript } from "@/lib/scroll";
import { site } from "@/data/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Container & Intermodal Equipment Surveys | Ports of LA & Long Beach | CCMS",
    template: "%s | Carew & Company Marine Survey",
  },
  description:
    "Independent container surveys and intermodal equipment inspections at the Ports of Los Angeles & Long Beach. Carew & Company Marine Survey, since 1980.",
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  telephone: "+1-310-713-2982",
  email: site.email,
  foundingDate: "1980",
  founder: { "@type": "Person", name: site.owner },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.streetAddress.line1,
    addressLocality: site.streetAddress.city,
    addressRegion: site.streetAddress.state,
    postalCode: site.streetAddress.zip,
    addressCountry: "US",
  },
  openingHours: "Mo-Fr 09:00-17:00",
  areaServed: ["Port of Los Angeles", "Port of Long Beach", "Southern California"],
  sameAs: [site.linkedin, site.yelp],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: scrollToTopScript }} />
        <ScrollToTop />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
