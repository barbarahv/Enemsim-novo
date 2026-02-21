"use client";

import { useState } from "react";
import { MessageCircle, Check, X, Bell } from "lucide-react";

interface WhatsAppModalProps {
    userId: number;
    token: string;
    onClose: () => void;
}

export default function WhatsAppModal({ userId, token, onClose }: WhatsAppModalProps) {
    const [step, setStep] = useState<"ask" | "form">("ask");
    const [whatsapp, setWhatsapp] = useState("");
    const [shifts, setShifts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleShift = (value: string) => {
        setShifts(prev =>
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        );
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/users/${userId}/preferences`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    whatsapp,
                    studyShift: shifts.join(","), // Saving as comma-separated string for simplicity in DB
                    wantsReminders: true
                })
            });
            onClose();
        } catch (error) {
            console.error("Failed to save preferences", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/users/${userId}/preferences`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wantsReminders: false })
            });
            onClose();
        } catch (error) {
            console.error("Failed to skip", error);
        }
    };

    if (step === "ask") {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                            Deseja ser lembrado de estudar?
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Podemos te enviar lembretes no WhatsApp para você não perder o ritmo.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setStep("form")}
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Sim, quero lembretes
                        </button>
                        <button
                            onClick={handleSkip}
                            className="w-full py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Não, obrigado
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Configurar Alertas</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            WhatsApp
                        </label>
                        <div className="relative">
                            <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="(00) 00000-0000"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Horários de Estudo (Múltipla escolha)
                        </label>
                        <div className="space-y-2">
                            {["MANHA", "TARDE", "NOITE"].map((shiftOption) => (
                                <label key={shiftOption} className="flex items-center space-x-3 p-3 border rounded-lg dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                                    <input
                                        type="checkbox"
                                        checked={shifts.includes(shiftOption)}
                                        onChange={() => toggleShift(shiftOption)}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-slate-700 dark:text-gray-200 font-medium capitalize">
                                        {shiftOption.toLowerCase()}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isLoading || !whatsapp || shifts.length === 0}
                        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 mt-2"
                    >
                        {isLoading ? "Salvando..." : "Confirmar Alertas"}
                    </button>
                </div>
            </div>
        </div>
    );
}
