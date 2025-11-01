import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
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
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Henrik Hof - Software architect delivering custom software and human‑centered AI",
    description: "Software architect delivering custom software and human‑centered AI. Zero Friction, Just Results.",
    images: ["https://henrikhof.com/henrikhof.jpg"],
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
