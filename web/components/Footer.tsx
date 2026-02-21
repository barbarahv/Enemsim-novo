"use client";

import { Mail } from "lucide-react";

import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    // Hide on Auth pages if desired. 
    // Usually footer is fine, but user wants STRICT strict separation.
    // Let's hide it to be safe and clean.
    // Footer is now global as requested


    return (
        <footer className="fixed bottom-0 left-0 right-0 w-full p-4 text-center z-50 pointer-events-none">
            <div className="pointer-events-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-semibold hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
                <a href="mailto:contatosimeducacional@gmail.com" className="hover:text-blue-500 transition-colors">
                    contatosimeducacional@gmail.com
                </a>
            </div>
        </footer>
    );
}
