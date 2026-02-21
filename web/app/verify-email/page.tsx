"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verificando seu email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Token inválido ou não fornecido.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/auth/verify-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus("success");
                    setMessage("Email verificado com sucesso!");
                } else {
                    setStatus("error");
                    setMessage(data.error || "Falha na verificação.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Erro de conexão com o servidor.");
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-sm w-full border border-gray-100 dark:border-slate-800">
            {status === "loading" && (
                <>
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Verificando...</h1>
                </>
            )}

            {status === "success" && (
                <>
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Sucesso!</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                    <button
                        onClick={() => router.push("/login")}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Ir para Login
                    </button>
                </>
            )}

            {status === "error" && (
                <>
                    <XCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Erro</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                    <button
                        onClick={() => router.push("/login")}
                        className="w-full py-3 bg-gray-200 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-xl hover:opacity-80 transition-colors"
                    >
                        Voltar ao Login
                    </button>
                </>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-white">Carregando...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
