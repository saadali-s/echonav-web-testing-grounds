import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Providers
import { AuthProvider } from "@/components/layout/auth-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

// Layout Components
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EchoNav",
  description: "Navigate with Confidence - Institutional Command Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SidebarProvider>
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}