import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Management Panel',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ManagementPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </head>
      {children}
    </>
  )
}

