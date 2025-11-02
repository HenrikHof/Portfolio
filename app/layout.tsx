import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "Henrik Hof - Software architect delivering custom software and human‑centered AI",
  description: "Software architect delivering custom software and human‑centered AI. Zero Friction, Just Results.",
  keywords: [
    "technology consultant",
    "software architect",
    "Next.js developer",
    "React developer",
    "custom software",
    "AI integration",
    "web development",
    "system architecture",
    "technology strategy",
    "software consulting"
  ],
  authors: [{ name: "Henrik Hof" }],
  icons: {
    icon: [
      { url: "/hhportfolioicon.png", sizes: "32x32", type: "image/png" },
      { url: "/hhportfolioicon.png", sizes: "192x192", type: "image/png" },
      { url: "/hhportfolioicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/hhportfolioicon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/hhportfolioicon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/hhportfolioicon.png",
        color: "#000000",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://henrikhof.com",
    title: "Henrik Hof - Software architect delivering custom software and human‑centered AI",
    description: "Software architect delivering custom software and human‑centered AI. Zero Friction, Just Results.",
    siteName: "Henrik Hof",
    images: [
      {
        url: "https://henrikhof.com/henrikhof.jpg",
        width: 1200,
        height: 1200,
        alt: "Henrik Hof - Software architect delivering custom software and human‑centered AI",
      },
      {
        url: "https://henrikhof.com/hhportfolioicon.png",
        width: 1024,
        height: 1024,
        alt: "Henrik Hof Portfolio Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Henrik Hof - Software architect delivering custom software and human‑centered AI",
    description: "Software architect delivering custom software and human‑centered AI. Zero Friction, Just Results.",
    images: [
      "https://henrikhof.com/henrikhof.jpg",
      "https://henrikhof.com/hhportfolioicon.png",
    ],
  },
  alternates: {
    canonical: "https://henrikhof.com",
  },
  other: {
    "contact:phone_number": "+351963429170",
    "contact:country_name": "Portugal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <head>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <Script 
          src="https://assets.calendly.com/assets/external/widget.js" 
          strategy="afterInteractive"
        />
        <Script id="calendly-badge" strategy="afterInteractive">
          {`
            (function() {
              function initCalendlyBadge() {
                if (typeof window !== 'undefined' && window.Calendly) {
                  window.Calendly.initBadgeWidget({ 
                    url: 'https://calendly.com/jphenrikhof/30min', 
                    text: 'Schedule time with me', 
                    color: '#0069ff', 
                    textColor: '#ffffff', 
                    branding: true 
                  });
                } else {
                  setTimeout(initCalendlyBadge, 100);
                }
              }
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initCalendlyBadge);
              } else {
                initCalendlyBadge();
              }
            })();
          `}
        </Script>
        <Script id="console-message" strategy="afterInteractive">
          {`
            (function() {
              const styles = {
                title: 'font-size: 32px; font-weight: bold; color: #3b82f6; text-shadow: 2px 2px 4px rgba(59,130,246,0.3);',
                message: 'font-size: 15px; color: #60a5fa; font-weight: 500;',
                highlight: 'font-size: 14px; color: #93c5fd; font-weight: normal;',
                link: 'font-size: 15px; color: #34d399; font-weight: bold;',
              };

              console.log('%c👋 Hey there, fellow developer!', styles.title);
              console.log('%cIf you\\'re reading this, we\\'re probably alike. Let\\'s connect!', styles.message);
              console.log('%cBuilt with Next.js 16 • React 19 • Tailwind CSS', styles.highlight);
              console.log('%c💼 https://www.linkedin.com/in/henrikhof/', styles.link);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
