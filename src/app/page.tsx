import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <h1 className={`${geistSans.className} text-3xl font-bold`}>
        Welcome to EchoNav
      </h1>
    </div>
  );
}