"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../../components/ThemeProvider";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sun, Moon } from "lucide-react";

export default function LoginPage() {
    const { theme, toggleTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Guard: If logged in, go to dashboard
    useEffect(() => {
        console.log("LoginPage mounted");
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        console.log("Auth State:", { token: !!token, user: !!user });

        if (token && user) {
            console.log("Redirecting to dashboard...");
            router.push("/dashboard");
        } else {
            // Ensure clean state if only one exists
            if (token || user) {
                console.log("Inconsistent state, clearing storage");
                localStorage.clear();
            }
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Falha no login");
            }

            // Save Token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect
            if (data.user.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
            alert(error.message || "Erro ao entrar.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 group hover:scale-110 transition-transform">
                        <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Bem-vindo!</h1>
                    <p className="text-gray-500 dark:text-gray-400">Digite suas credenciais para acessar sua conta.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="exemplo@email.com" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="••••••••" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isLoading ? "Entrando..." : (
                            <>Entrar <ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        Não tem uma conta?{" "}
                        <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            Crie uma agora
                        </Link>
                    </p>
                </div>
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Theme"
            >
                {theme === "DARK" ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-slate-600" />}
            </button>
        </div>
    );
}
