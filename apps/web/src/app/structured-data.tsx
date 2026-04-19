/**
 * JSON-LD structured data for search engines and AI crawlers.
 * All content is a static, developer-controlled JSON literal — safe by construction.
 */
import Script from "next/script";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://subtracker-web-six.vercel.app";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "SubTracker",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web, Docker, Linux",
      description:
        "Open-source subscription tracker. Import CSV from Fio, Revolut, or Wise. See every renewal before it hits. Self-hostable.",
      url: APP_URL,
      image: `${APP_URL}/og-image.png`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      softwareVersion: "0.5.0",
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
      downloadUrl: "https://github.com/Buggy1111/subtracker",
      codeRepository: "https://github.com/Buggy1111/subtracker",
      programmingLanguage: "TypeScript",
      author: {
        "@type": "Person",
        name: "Michal Burget",
        url: "https://github.com/Buggy1111",
      },
    },
    {
      "@type": "WebSite",
      name: "SubTracker",
      url: APP_URL,
      publisher: {
        "@type": "Person",
        name: "Michal Burget",
      },
    },
  ],
};

export function StructuredData() {
  return (
    <Script id="subtracker-ld-json" type="application/ld+json" strategy="beforeInteractive">
      {JSON.stringify(STRUCTURED_DATA)}
    </Script>
  );
}
