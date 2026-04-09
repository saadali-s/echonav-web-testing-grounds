import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Providers
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/components/layout/auth-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

// Layout Components
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EchoNav",
  description: "Navigate with Confidence - Institutional Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required on the <html> tag when using next-themes
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} bg-zinc-50 dark:bg-zinc-900 flex h-screen overflow-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SidebarProvider>
              {/* Sidebar Component */}
              <Sidebar />

              {/* Main Content Wrapper */}
              <div className="flex-1 flex flex-col min-w-0">
                <Header />

                {/* Scrollable Main Area */}
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
