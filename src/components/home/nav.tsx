import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

export default function Nav() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 dark:border-zinc-800">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Empty className="flex items-center justify-between w-full">
                    <EmptyHeader className="flex flex-col gap-1">
                        <EmptyTitle className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Monitor the status of your beacons in real-time <br />
                            with <span className="text-blue-600 dark:text-blue-400">EchoNav's</span> intuitive dashboard.
                        </EmptyTitle>
                        <EmptyDescription className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                            Click the "Get Started" button to access your personalized dashboard and <br />
                            stay connected with your fleet's activities.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="flex items-center gap-3">
                        <Button variant="ghost" className="px-4 py-2 text-xs font-medium transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            Learn More
                        </Button>
                        <Button className="px-5 py-2 text-xs font-bold bg-zinc-900 text-white rounded-full shadow-md hover:bg-zinc-800 active:scale-95 transition-all dark:bg-zinc-100 dark:text-zinc-900">
                            Get Started
                        </Button>
                    </EmptyContent>
                </Empty>
            </div>
        </nav>
    )
}