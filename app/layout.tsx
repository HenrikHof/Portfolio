import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import Script from "next/script"
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
      <body className="font-sans antialiased">
        {children}
        <Script id="console-message" strategy="afterInteractive">
          {`
            (function() {
              const styles = {
                title: 'font-size: 24px; font-weight: bold; color: #3b82f6; font-family: monospace;',
                subtitle: 'font-size: 14px; color: #64748b; font-family: monospace;',
                message: 'font-size: 13px; color: #0f172a; font-family: monospace; line-height: 1.6;',
                highlight: 'font-size: 13px; color: #3b82f6; font-weight: bold; font-family: monospace;',
                link: 'font-size: 13px; color: #3b82f6; font-family: monospace; text-decoration: underline;',
                divider: 'color: #cbd5e1; font-family: monospace;',
                emoji: 'font-size: 16px;'
              };

              console.clear();
              console.log('%c╔═══════════════════════════════════════════════════════════════╗', styles.divider);
              console.log('%c║                                                               ║', styles.divider);
              console.log('%c║   %cHey there, fellow developer! 👋%c                           ║', styles.divider, styles.title, styles.divider);
              console.log('%c║                                                               ║', styles.divider);
              console.log('%c╚═══════════════════════════════════════════════════════════════╝', styles.divider);
              console.log('');
              console.log('%c✨ Nice to meet you!', styles.highlight);
              console.log('');
              console.log('%cIf you\\'re reading this, we\\'re probably alike —', styles.message);
              console.log('%ccurious, detail-oriented, and always looking under the hood.', styles.message);
              console.log('');
              console.log('%c💡 Fun fact:', styles.highlight);
              console.log('%cWhile most people see a website, you see the architecture,', styles.message);
              console.log('%cthe patterns, the possibilities. That\\'s what I love about this craft.', styles.message);
              console.log('');
              console.log('%c🚀 About this site:', styles.highlight);
              console.log('%c• Built with Next.js 15 & React 19', styles.message);
              console.log('%c• Styled with Tailwind CSS', styles.message);
              console.log('%c• Deployed on Vercel', styles.message);
              console.log('%c• Crafted with attention to detail', styles.message);
              console.log('');
              console.log('%c💬 Let\\'s connect:', styles.highlight);
              console.log('%cI\\'m always interested in talking tech, collaboration, or just', styles.message);
              console.log('%cgeeking out about clean code and great UX.', styles.message);
              console.log('');
              console.log('%c📬 Reach out: %chttps://henrikhof.com', styles.message, styles.link);
              console.log('');
              console.log('%c════════════════════════════════════════════════════════════════', styles.divider);
              console.log('%cP.S. Yes, I know you can see the source code. Feel free to peek! 😊', styles.subtitle);
              console.log('%c════════════════════════════════════════════════════════════════', styles.divider);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
