"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function NavigationBar() {
    return (
        <motion.nav 
            suppressHydrationWarning
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 w-full z-50 border-b border-zinc-800/80 bg-black/70 backdrop-blur-2xl transition-all"
        >
            <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    {/* Explicitly accommodating the black logo with a polished white housing */}
                    <div className="bg-white/95 p-2 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 group-hover:scale-105 border border-zinc-200">
                        <Image 
                            src="/EchonavLogo.svg" 
                            alt="EchoNav Logo" 
                            width={22} 
                            height={22} 
                            className="opacity-90"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors">EchoNav</span>
                </Link>
                
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <Link href="#features" className="hover:text-white transition-colors duration-200">Features</Link>
                    <Link href="#fleet" className="hover:text-white transition-colors duration-200">Fleet</Link>
                    <Link href="#about" className="hover:text-white transition-colors duration-200">About</Link>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <Link href="/auth?tab=login">
                        {/* Fixed Login button - Now clearly a button */}
                        <Button variant="outline" className="text-sm font-semibold text-zinc-300 border-zinc-700 bg-transparent hover:text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all hidden sm:flex h-10 px-5 rounded-lg">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/auth?tab=signup">
                        {/* High contrast primary button */}
                        <Button className="bg-white text-black hover:bg-zinc-200 rounded-lg px-6 h-10 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 font-bold">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}