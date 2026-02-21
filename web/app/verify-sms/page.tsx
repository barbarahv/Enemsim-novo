"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquare, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";

function VerifySmsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Fix: Handle potential null searchParams and unnecessary re-renders
    const userId = searchParams?.get("userId");
    const email = searchParams?.get("email");

    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/auth/verify-sms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, code })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Código inválido");

            // Success
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setMessage("Sucesso! Redirecionando...");
            setTimeout(() => router.push("/dashboard"), 1500);

        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/auth/resend-sms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            });
            if (res.ok) alert("Novo código enviado! (Verifique o console do backend)");
        } catch (e) {
            alert("Erro ao reenviar");
        }
    };

    if (!userId) {
        return <div className="p-8 text-center">ID do usuário não encontrado na URL.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Verifique seu Celular</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Enviamos um código SMS para o seu número cadastrado.
                        <br />
                        <span className="text-xs opacity-70">(Simulação: Verifique o console do servidor)</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 text-center">
                            Código de 6 Dígitos
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full text-center text-3xl font-bold tracking-widest py-4 bg-gray-50 dark:bg-slate-950 border-2 border-gray-200 dark:border-slate-800 rounded-xl focus:border-blue-500 outline-none transition-all dark:text-white"
                            placeholder="000000"
                            required
                        />
                    </div>

                    {message && (
                        <div className={`text-center text-sm font-bold ${message.includes("Sucesso") ? "text-green-500" : "text-red-500"}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || code.length < 6}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Verificando..." : "Confirmar Código"}
                        {!isLoading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleResend}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reenviar Código
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function VerifySmsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <VerifySmsContent />
        </Suspense>
    );
}
