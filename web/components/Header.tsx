"use client";

import Link from "next/link";
import { GraduationCap, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check auth on mount
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
        };

        checkAuth();

        // Listen for storage changes (e.g. login/logout in another tab)
        const handleStorageChange = () => checkAuth();
        window.addEventListener('storage', handleStorageChange);

        // Simple polling to ensure UI is in sync if localstorage changes in same tab without event
        const interval = setInterval(checkAuth, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        router.push("/login");
    };

    // Hide Header on Login/Register/Root/Admin pages
    if (pathname && ["/", "/login", "/register", "/admin", "/dashboard"].includes(pathname)) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full p-4 flex justify-between items-center bg-[#2c3e50] shadow-md text-white">
            <div className="flex items-center gap-2">
                <GraduationCap className="text-yellow-400 w-8 h-8" />
                <h1 className="text-xl font-bold tracking-wide">
                    <span className="text-yellow-400">AI</span><span className="text-white">SIM</span>
                </h1>
            </div>
            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="text-sm font-bold bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-full transition-colors"
                    >
                        SAIR
                    </button>
                ) : (
                    <Link href="/login" className="text-sm font-bold bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-4 py-2 rounded-full transition-colors">
                        ENTRAR
                    </Link>
                )}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Toggle Theme"
                >
                    {theme === "DARK" ? <Sun className="w-6 h-6 text-yellow-300" /> : <Moon className="w-6 h-6 text-slate-200" />}
                </button>
            </div>
        </header>
    );
}
