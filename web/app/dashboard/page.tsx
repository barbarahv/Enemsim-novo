"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ClipboardCheck, Globe2, Sun, Moon, Mail, BellOff } from 'lucide-react';
import { ModuleCard } from '@/components/homepage/ModuleCard';
import { ImageWithFallback } from '@/components/homepage/figma/ImageWithFallback';
import { AiSimIcon } from '@/components/homepage/AiSimIcon';
import { motion } from 'motion/react';
import { useTheme } from "../../components/ThemeProvider";
import WhatsAppModal from "../../components/WhatsAppModal";

export default function Dashboard() {
    const { theme, toggleTheme } = useTheme();
    // derived state for styling if needed, but we mostly use the toggle for global theme
    const isDarkMode = theme === "DARK";

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    // Auth Guard & Preference Check from original Dashboard
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            localStorage.clear();
            router.push("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setLoading(false);

            if (!parsedUser.onboardingSkipped && parsedUser.wantsReminders !== false) {
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.clear();
            router.push("/login");
        }
    }, [router]);

    const handleModalClose = () => {
        setShowModal(false);
        if (user) {
            const updatedUser = { ...user, onboardingSkipped: true };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const disableAlerts = async () => {
        if (!confirm("Tem certeza que deseja desativar os alertas de estudo?")) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/users/${user.id}/preferences`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wantsReminders: false })
            });
            alert("Alertas desativados.");
            const updatedUser = { ...user, wantsReminders: false };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error) {
            alert("Erro ao desativar.");
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Navigation Handlers
    const goToEnem = () => router.push("/enemsim");
    const goToConcurso = () => router.push("/concursim");
    const goToLanguages = () => window.open("https://play.google.com/store/apps/details?id=com.gabrielhansen.voxidiomas&pcampaignid=web_share", "_blank");

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#0A2540]' : 'bg-gray-50'} transition-colors duration-500`}>
            {/* Header with theme toggle */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AiSimIcon className="w-10 h-10" isDarkMode={isDarkMode} />
                        <h1 className="text-xl font-bold tracking-wide flex items-center">
                            <span className="text-yellow-400">AI</span>
                            <span className={isDarkMode ? "text-white" : "text-gray-800"}>SIM</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* User Greeting */}
                        <span className={`hidden md:block font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Olá, {user?.name || 'Estudante'}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="text-sm font-bold bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-full transition-colors"
                        >
                            SAIR
                        </button>

                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 1, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-2 md:mb-16"
                    >
                        {/* Logo */}
                        <div className="mb-8">
                            <h1 className="text-7xl md:text-9xl font-black mb-4">
                                <span className="text-yellow-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">AI</span>
                                <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>SIM</span>
                            </h1>
                            <div className="flex items-center justify-center">
                                <div className={`h-1 w-64 ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white to-transparent' : 'bg-gradient-to-r from-transparent via-gray-400 to-transparent'}`} />
                            </div>
                        </div>

                        {/* Tagline */}
                        <div className="space-y-4 mb-8">
                            <p className={`text-xl md:text-2xl ${isDarkMode ? 'text-white' : 'text-gray-700'} font-semibold`}>
                                PREPARATÓRIO PARA
                            </p>
                            <p className={`text-xl md:text-2xl ${isDarkMode ? 'text-white' : 'text-gray-700'} font-semibold`}>
                                ENEM, CONCURSOS PÚBLICOS E IDIOMAS
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Modules Section */}
            <section className="py-8 md:py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center"
                    >
                        <ModuleCard
                            title="ENEMSIM"
                            icon={GraduationCap}
                            color="blue"
                            onClick={goToEnem}
                        />
                        <ModuleCard
                            title="CONCURSIM"
                            icon={ClipboardCheck}
                            color="green"
                            onClick={goToConcurso}
                        />
                        <ModuleCard
                            title="POLYLINGUE"
                            icon={Globe2}
                            color="darkblue"
                            onClick={goToLanguages}
                        />
                    </motion.div>
                </div>
            </section>

            {/* Helper / Settings Actions (from original dashboard) */}
            <section className="py-4 px-4 text-center">
                {user?.wantsReminders !== false && (
                    <button
                        onClick={disableAlerts}
                        className={`text-xs flex items-center gap-1 mx-auto transition-colors ${isDarkMode ? 'text-white/40 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}
                    >
                        <BellOff className="w-3 h-3" />
                        Desativar alertas de estudo
                    </button>
                )}
            </section>

            {/* Image Section */}
            <section className="py-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 1, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGhlYWRwaG9uZXMlMjBsYXB0b3AlMjBzdHVkeWluZyUyMGhvbWUlMjBkZXNrfGVufDF8fHx8MTc3MDU3NTQzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Mulher estudando online"
                            className="w-full h-auto"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-12 px-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className={`inline-flex items-center gap-3 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} px-8 py-4 rounded-full transition-colors cursor-pointer`}
                    >
                        <Mail className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                        <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            contatosimeducacional@gmail.com
                        </span>
                    </motion.div>

                    <p className={`mt-8 text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        © 2026 AI SIM - Educação de qualidade, acessível e gratuita
                    </p>
                </div>
            </footer>

            {showModal && user && (
                <WhatsAppModal
                    userId={user.id}
                    token={localStorage.getItem("token") || ""}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}
