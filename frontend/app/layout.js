import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'BarakahVault - Ethical Islamic Investment',
  description: 'Invest ethically, calculate Zakat accurately, and give transparently.',
}

export default function RootLayout({ children }) {
  // We'll render sidebar/navbar conditionally or always, 
  // but usually login page doesn't have sidebar. 
  // For simplicity MVP, we'll put sidebar on all pages except login?
  // Actually, Next.js Layouts persist. 

  // To keep it simple: We'll render them, but use CSS to hide on login page 
  // OR we create a (dashboard) route group. 
  // Let's use route groups (dashboard) for internal pages.
  // Actually, simplest is just render children. 
  // Let's assume most pages need the layout.

  return (
    <html lang="en">
      <body className={inter.variable}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
