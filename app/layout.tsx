import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Butterbot from '@/components/butterbot';

import { ToasterProvider } from '@/components/toaster-provider'
import { ModalProvider } from '@/components/modal-provider'
import { CrispProvider } from '@/components/crisp-provider'
import { ThemeProvider } from '@/components/theme-provider';

import './globals.css'

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ButterBot',
  description: 'AI Platform',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        {/* <CrispProvider /> */}
        <Butterbot />
        <body className={font.className}>
          <ToasterProvider />
          <ModalProvider />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>  {/* add ThemeProvider here */}
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}