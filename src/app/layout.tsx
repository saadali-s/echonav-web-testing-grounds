import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EchoNav Admin Portal",
  description: "Institutional Command Center for EchoNav",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light font-sans"> 
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-900 flex h-screen overflow-hidden antialiased`}>
        {/* We default the html tag to 'light' above for the dashboard feel */}
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}