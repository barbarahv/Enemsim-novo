"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    CheckCircle,
    Lock,
    Scale,      // Ética/Direito
    Newspaper,  // Atualidades
    Monitor,    // Informática
    Gavel,      // Constitucional
    Building2,  // Administrativo
    Brain,      // Raciocínio Lógico
    Calculator, // Matemática
    Book,       // Português
    Feather,    // Redação
    FileText,   // Simulado
    Star
} from "lucide-react";

// --- Configuration & Helpers ---

// 1. Structure Definition (9 Lessons + 1 Simulado)
const moduleSchedule = [
    { id: 1, subject: "Ética e Cidadania", icon: Scale, color: "text-teal-600" },
    { id: 2, subject: "Atualidades", icon: Newspaper, color: "text-sky-600" },
    { id: 3, subject: "Informática", icon: Monitor, color: "text-indigo-600" },
    { id: 4, subject: "Direito Constitucional", icon: Gavel, color: "text-yellow-600" },
    { id: 5, subject: "Direito Administrativo", icon: Building2, color: "text-slate-600" },
    { id: 6, subject: "Raciocínio Lógico", icon: Brain, color: "text-pink-600" },
    { id: 7, subject: "Matemática", icon: Calculator, color: "text-red-600" },
    { id: 8, subject: "Português", icon: Book, color: "text-blue-600" },
    { id: 9, subject: "Redação", icon: Feather, color: "text-purple-600" },
];

const getModuleTitle = (num: number) => {
    // Simple mock titles for modules
    if (num === 1) return "Fundamentos Iniciais";
    if (num === 2) return "Aprofundamento Jurídico";
    if (num === 3) return "Conhecimentos Específicos";
    return "Módulo Avançado";
};

// 2. Generate Curriculum (e.g., 10 Modules)
const generateCurriculum = () => {
    const modules = [];
    for (let i = 1; i <= 10; i++) {
        const lessonNodes = moduleSchedule.map((item, idx) => ({
            ...item,
            module: i,
            lessonIndex: idx, // 0 to 8
            label: `AULA ${idx + 1}`,
        }));

        modules.push({
            moduleNumber: i,
            title: getModuleTitle(i),
            lessons: lessonNodes
        });
    }
    return modules;
};

// Define explicit type to fix TS inference errors
interface LessonItem {
    id: number;
    subject: string;
    icon: any;
    color: string;
    isExam?: boolean; // Optional property
    module: number;
    lessonIndex: number;
    label: string;
}

const curriculum = generateCurriculum() as {
    moduleNumber: number;
    title: string;
    lessons: LessonItem[];
}[];

export default function ConcursimPage() {
    // State for user progress
    const [userProgress, setUserProgress] = useState<{
        completedModules: number[];
        completedLessons: { module: number; lessonIndex: number; score?: number }[];
    }>({ completedModules: [], completedLessons: [] });

    const [isLoaded, setIsLoaded] = useState(false);

    // Load progress from Backend on mount and sync with local
    useEffect(() => {
        const fetchProgress = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;
            const user = JSON.parse(storedUser);

            // 1. Get Local Data
            const storedLocal = localStorage.getItem('concursimProgress');
            let localProgress = storedLocal ? JSON.parse(storedLocal) : { completedModules: [], completedLessons: [] };

            try {
                // 2. Get Backend Data
                const res = await fetch(`http://127.0.0.1:3002/users/${user.id}/progress`);
                const backendData = await res.json();

                // 3. Merge Strategies
                // We want to combine unique completions from both.

                const backendLessons = backendData.completedLessons || [];
                const backendModules = backendData.completedModules || [];

                // Merge Lessons (Unique by module + lessonIndex)
                const mergedLessons = [...localProgress.completedLessons];
                backendLessons.forEach((bl: any) => {
                    if (!mergedLessons.find((ml: any) => ml.module === bl.module && ml.lessonIndex === bl.lessonIndex)) {
                        mergedLessons.push(bl);
                    }
                });

                // Merge Modules (Unique IDs)
                const mergedModules = Array.from(new Set([...localProgress.completedModules, ...backendModules]));

                const finalProgress = {
                    completedModules: mergedModules,
                    completedLessons: mergedLessons
                };

                // 4. Update State and Local Storage
                setUserProgress(finalProgress);
                localStorage.setItem('concursimProgress', JSON.stringify(finalProgress));

                // 5. Sync Back to Backend (if local had items that backend missed)
                // Only if merge resulted in differences from backend
                if (mergedLessons.length > backendLessons.length || mergedModules.length > backendModules.length) {
                    fetch(`http://127.0.0.1:3002/users/${user.id}/progress`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(finalProgress)
                    }).catch(err => console.error("Background sync failed", err));
                }

            } catch (error) {
                console.error("Failed to sync progress:", error);
                // Fallback to local
                setUserProgress(localProgress);
            }
            setIsLoaded(true);
        };

        fetchProgress();
    }, []);

    // Helper to check completion
    const checkLessonCompletion = (modNum: number, lessonIndex: number) => {
        const lesson = userProgress.completedLessons.find(l => l.module === modNum && l.lessonIndex === lessonIndex);
        if (!lesson) return false;
        return (lesson.score || 0) >= 0; // Allow any score for completion
    };

    const isModuleFullyCompleted = (modNum: number) => {
        // Module is done if Last Lesson (Redação - Index 8) is done
        return checkLessonCompletion(modNum, 8);
    };

    if (!isLoaded) return null; // Or loading spinner

    return (
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-slate-950 flex flex-col items-center relative overflow-x-hidden">

            {/* Header Fixed */}
            <div className="w-full bg-white dark:bg-slate-900 shadow-sm py-6 px-4 text-center z-20 sticky top-[72px]">
                <h1 className="text-xl font-extrabold text-slate-800 dark:text-white uppercase tracking-wide">
                    Trilha Concursos
                </h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">10 Módulos • 90 Aulas</p>
            </div>

            {/* Timeline Container */}
            <div className="w-full max-w-md p-6 pt-32 pb-32 relative flex flex-col items-center">

                {/* Dashed Path Line */}
                <div className="absolute left-1/2 top-4 bottom-0 w-[2px] border-l-2 border-dashed border-gray-300 dark:border-slate-800 -translate-x-1/2 z-0"></div>

                {curriculum.map((module, modIndex) => {
                    // MODULE LOCKING LOGIC
                    // Module 1 is always unlocked.
                    // Module N is unlocked if Module N-1 is fully completed.
                    const isModuleUnlocked = module.moduleNumber === 1 || isModuleFullyCompleted(module.moduleNumber - 1);

                    return (
                        <div key={module.moduleNumber} className={`w-full flex flex-col items-center mb-16 z-10 ${!isModuleUnlocked ? 'opacity-50' : ''}`}>

                            {/* Module Header */}
                            <div className={`
                                group relative px-8 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-10 shadow-lg border-4 border-[#f5f5f5] dark:border-slate-950 z-10 flex items-center gap-3
                                ${isModuleUnlocked ? 'bg-indigo-600 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}
                            `}>
                                {isModuleUnlocked ? '' : <Lock className="inline w-3 h-3 mr-2 -mt-0.5" />}
                                <span>MÓDULO {module.moduleNumber} • {module.title}</span>

                                {/* Average Score Badge */}
                                {(() => {
                                    const modLessons = userProgress.completedLessons.filter(l => l.module === module.moduleNumber);
                                    if (modLessons.length > 0) {
                                        const total = modLessons.reduce((acc, curr) => acc + (curr.score || 0), 0);
                                        const avg = Math.round(total / modLessons.length);
                                        return (
                                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2 font-extrabold" title="Média do módulo">
                                                ★ {avg}%
                                            </span>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Module Lock Tooltip */}
                                {!isModuleUnlocked && (
                                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[250px] bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-50 text-center pointer-events-none">
                                        Conclua o módulo anterior para avançar.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                    </div>
                                )}
                            </div>

                            {/* Lessons Grid */}
                            <div className="w-full flex flex-col gap-12 relative">
                                {module.lessons.map((item, lessonIdx) => {
                                    const Icon = item.icon;

                                    // LESSON LOCKING LOGIC
                                    // First lesson (index 0) unlocks if Module is unlocked.
                                    // Others unlock if Previous Lesson (index-1) is Completed.
                                    let isLessonUnlocked = false;
                                    if (lessonIdx === 0) {
                                        isLessonUnlocked = isModuleUnlocked;
                                    } else {
                                        const prevCompleted = checkLessonCompletion(module.moduleNumber, item.lessonIndex - 1);
                                        isLessonUnlocked = isModuleUnlocked && prevCompleted;
                                    }

                                    const lessonData = userProgress.completedLessons.find(l => l.module === module.moduleNumber && l.lessonIndex === item.lessonIndex);
                                    const isCompleted = !!lessonData && (item.isExam || (lessonData.score || 0) >= 0);

                                    // Lock/Success Messages
                                    let lockMessage = "";
                                    let successMessage = "";

                                    if (!isModuleUnlocked) {
                                        lockMessage = "Conclua o módulo anterior.";
                                    } else if (!isLessonUnlocked) {
                                        lockMessage = "Conclua a aula anterior para acessar.";
                                    } else if (isCompleted) {
                                        if (item.isExam) {
                                            successMessage = "Módulo concluído! Avance para o próximo.";
                                        } else {
                                            successMessage = "Concluído! Avance para a próxima aula.";
                                        }
                                    }

                                    // Zig-Zag Logic
                                    const isLeft = lessonIdx % 2 === 0;

                                    return (
                                        <div key={`${module.moduleNumber}-${item.lessonIndex}`} className={`flex w-full ${isLeft ? 'justify-start md:justify-center md:-translate-x-16' : 'justify-end md:justify-center md:translate-x-16'} transition-all`}>

                                            <div className="relative group flex flex-col items-center">
                                                <Link
                                                    href={isLessonUnlocked ? `/concursim/module/${module.moduleNumber}/subject/${item.id}` : "#"}
                                                    className={`flex flex-col items-center ${isLessonUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                                    onClick={(e) => !isLessonUnlocked && e.preventDefault()}
                                                >

                                                    {/* Node Circle */}
                                                    <div className={`
                                                        w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 relative z-10 transition-transform duration-300
                                                        ${isCompleted
                                                            ? 'bg-white border-green-500 hover:scale-105'
                                                            : isLessonUnlocked
                                                                ? 'bg-white border-indigo-200 group-hover:scale-110'
                                                                : 'bg-gray-200 border-gray-300 grayscale opacity-80'
                                                        }
                                                    `}>
                                                        {isCompleted ? (
                                                            <div className="flex flex-col items-center justify-center">
                                                                <CheckCircle className="w-8 h-8 text-green-600" />
                                                            </div>
                                                        ) : (
                                                            <Icon className={`w-8 h-8 ${isLessonUnlocked ? item.color : 'text-gray-400'}`} />
                                                        )}

                                                        {!isLessonUnlocked && (
                                                            <div className="absolute inset-0 bg-black/5 rounded-full flex items-center justify-center">
                                                                <Lock className="w-6 h-6 text-gray-500" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Label & Score */}
                                                    <div className={`
                                                        mt-3 px-3 py-1.5 rounded-lg shadow-sm text-center border min-w-[100px] flex flex-col items-center
                                                        ${isLessonUnlocked ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700' : 'bg-transparent border-transparent opacity-50'}
                                                    `}>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">{item.label}</div>
                                                        <div className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{item.subject}</div>

                                                        {/* Score Badge */}
                                                        {isCompleted && lessonData && (
                                                            <div className="mt-1 text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                                {lessonData.score}% ACERTOS
                                                            </div>
                                                        )}
                                                    </div>

                                                </Link>

                                                {/* Tooltips */}
                                                {!isLessonUnlocked && lockMessage && (
                                                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[220px] bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 text-center pointer-events-none">
                                                        {lockMessage}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-slate-800"></div>
                                                    </div>
                                                )}
                                                {isCompleted && successMessage && (
                                                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[220px] bg-green-600 text-white text-xs p-3 rounded-lg shadow-xl z-50 text-center pointer-events-none">
                                                        {successMessage}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-green-600"></div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
