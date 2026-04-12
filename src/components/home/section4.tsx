export default function Footer() {
    return (
        <footer className="w-full py-8 bg-black border-t border-white/10">
            <div className="container mx-auto px-4">
                <p className="text-sm text-white text-center">
                    &copy; {new Date().getFullYear()} EchoNav. All rights reserved.
                </p>
            </div>
        </footer>
    )
}