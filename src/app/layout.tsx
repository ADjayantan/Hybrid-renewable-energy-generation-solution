import type { Metadata } from 'next';
import { Chakra_Petch, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const chakra = Chakra_Petch({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chakra',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HRES — Hybrid Renewable Energy Generation Solution',
  description: 'A software simulation and Energy Management System (EMS) dashboard for solar + wind + battery + grid systems.',
  authors: [{ name: 'Jayantan' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${chakra.variable} ${ibmPlexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-mono">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* Footer with Student details */}
        <footer className="border-t border-panel-border bg-panel py-8 px-4 text-center mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-battery animate-pulse" />
              <span>HRES Simulation Engine v1.0.0 // Local Station Running</span>
            </div>
            <div className="flex flex-col md:items-end text-center md:text-right">
              <p className="text-gray-400 font-medium font-chakra text-sm">
                Project Lead: <span className="text-solar font-semibold">Jayantan</span>
              </p>
              <p className="mt-0.5">Department of Computer Science and Engineering</p>
              <p className="text-[10px] text-gray-600">VSB College of Engineering Technical Campus, Coimbatore</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
