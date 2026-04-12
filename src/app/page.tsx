import { Geist } from "next/font/google";
import Home from "@/components/home/Home";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function HomePage() {
  return (
    <Home />
  );
}