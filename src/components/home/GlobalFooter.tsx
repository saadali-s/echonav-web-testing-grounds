import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function GlobalFooter() {
    return (
        <footer className="w-full pt-16 pb-8 bg-black border-t border-zinc-900 text-zinc-500 relative z-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">EchoNav</span>
                        </div>
                        <p className="text-sm font-medium text-zinc-500 max-w-xs leading-relaxed">
                            Enterprise-grade indoor routing and fleet management solutions.
                        </p>
                    </div>
                    
                    <div className="flex gap-8 text-sm font-semibold">
                        <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1 group">
                            Privacy Policy <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1 group">
                            Terms of Service <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-zinc-900/80">
                    <p className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
                        &copy; {new Date().getFullYear()} ECHONAV TECHNOLOGIES. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    </div>
                </div>
            </div>
        </footer>
    )
}