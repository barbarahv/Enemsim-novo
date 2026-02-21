"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Phone, BookOpen, Calendar, CheckSquare } from "lucide-react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [education, setEducation] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // Initialize router
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple validation
        if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    age,
                    sex,
                    education,
                    termsAccepted,
                    privacyAccepted,
                    whatsapp: phone // Mapping phone input to whatsapp field expected by backend
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Falha ao registrar");
            }

            // Auto-login after register
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/dashboard");

        } catch (error: any) {
            alert(error.message || "Erro ao criar conta.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 group hover:scale-110 transition-transform">
                        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Crie sua conta</h1>
                    <p className="text-gray-500 dark:text-gray-400">Comece sua jornada de aprovação hoje mesmo.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Nome Completo</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                placeholder="Seu nome"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                placeholder="exemplo@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">WhatsApp</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Idade</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="Ano"
                                    required
                                    min="10"
                                    max="100"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Sexo</label>
                            <select
                                value={sex}
                                onChange={(e) => setSex(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Escolaridade</label>
                        <div className="relative">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                                required
                            >
                                <option value="">Selecione sua escolaridade</option>
                                <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
                                <option value="Ensino Médio Cursando">Ensino Médio Cursando</option>
                                <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                                <option value="Ensino Superior Cursando">Ensino Superior Cursando</option>
                                <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                placeholder="Mínimo 8 caracteres"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-start gap-3">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 checked:bg-blue-600 checked:border-transparent focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                                    required
                                />
                                <CheckSquare className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                Aceito os <Link href="/terms" className="text-blue-600 hover:underline">Termos de Uso</Link>
                            </label>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    checked={privacyAccepted}
                                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 checked:bg-blue-600 checked:border-transparent focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                                    required
                                />
                                <CheckSquare className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                Aceito a <Link href="/privacy" className="text-blue-600 hover:underline">Política de Privacidade</Link>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Criando conta..." : (
                            <>
                                Criar Conta e Começar
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            Fazer Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
