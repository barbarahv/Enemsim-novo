"use client";

import { Book, Calculator, Feather, Globe, Beaker, FileText, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Fragment } from "react";

// Helper to generate the full curriculum
const generateCurriculum = () => {
    const weeks = [];

    // Fixed Schedule Definition
    const scheduleTemplate = [
        { day: 1, title: "SEGUNDA-FEIRA", subject: "Humanas", icon: Globe, color: "text-orange-500" },
        { day: 2, title: "TERÇA-FEIRA", subject: "Linguagens", icon: Book, color: "text-blue-500" },
        { day: 3, title: "QUARTA-FEIRA", subject: "Natureza", icon: Beaker, color: "text-green-500" },
        { day: 4, title: "QUINTA-FEIRA", subject: "Matemática", icon: Calculator, color: "text-red-500" },
        { day: 5, title: "SEXTA-FEIRA", subject: "Redação", icon: Feather, color: "text-purple-500" },
        { day: 6, title: "SÁBADO", subject: "Simulado", icon: FileText, color: "text-yellow-500", isExam: true },
    ];

    for (let i = 1; i <= 40; i++) {
        const weekDays: any[] = [];

        scheduleTemplate.forEach((template) => {
            if (template.isExam) {
                // Day 6: Simulado (Index 10 for the week)
                // 5 days * 2 lessons = 10 lessons before simulado. Simulado is index 10.
                weekDays.push({
                    ...template,
                    lessons: [
                        { lessonIndex: 10, label: "SIMULADO", type: "exam" }
                    ]
                });
            } else {
                // Days 1-5: 2 Lessons per day
                // Day 1: 0, 1
                // Day 2: 2, 3
                // ...
                const baseIndex = (template.day - 1) * 2;
                weekDays.push({
                    ...template,
                    lessons: [
                        { lessonIndex: baseIndex, label: "AULA 1", type: "lesson" },
                        { lessonIndex: baseIndex + 1, label: "AULA 2", type: "lesson" }
                    ]
                });
            }
        });

        weeks.push({
            weekNumber: i,
            title: getWeekTitle(i),
            days: weekDays
        });
    }
    return weeks;
};

const getWeekTitle = (num: number) => {
    if (num <= 4) return "Fundamentos";
    if (num <= 8) return "Ciências Humanas";
    if (num <= 12) return "Linguagens";
    if (num <= 16) return "Natureza";
    if (num <= 20) return "Aprofundamento";
    return "Reta Final";
};

const curriculum = generateCurriculum();

export default function EnemsimPage() {
    // State for user progress
    const [userProgress, setUserProgress] = useState<{
        completedWeeks: number[];
        completedLessons: { week: number; lessonIndex: number; score?: number }[];
    }>({ completedWeeks: [], completedLessons: [] });

    const [isLoaded, setIsLoaded] = useState(false);

    // Load progress from Backend on mount
    useEffect(() => {
        const fetchProgress = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;
            const user = JSON.parse(storedUser);

            try {
                const res = await fetch(`http://127.0.0.1:3002/users/${user.id}/progress`);
                const data = await res.json();

                if (data && (data.completedWeeks || data.completedLessons)) {
                    setUserProgress({
                        completedWeeks: data.completedWeeks || [],
                        completedLessons: data.completedLessons || []
                    });
                    // Also update local storage to keep in sync
                    localStorage.setItem('userProgress', JSON.stringify({
                        completedWeeks: data.completedWeeks || [],
                        completedLessons: data.completedLessons || []
                    }));
                } else {
                    // Fallback to local if nothing on server (first time sync?)
                    const stored = localStorage.getItem('userProgress');
                    if (stored) setUserProgress(JSON.parse(stored));
                }
            } catch (error) {
                console.error("Failed to sync progress:", error);
                // Fallback
                const stored = localStorage.getItem('userProgress');
                if (stored) setUserProgress(JSON.parse(stored));
            }
            setIsLoaded(true);
        };

        fetchProgress();
    }, []);

    // Helper to check completion
    const checkLessonCompletion = (weekNum: number, lessonIndex: number, isExam: boolean) => {
        const lesson = userProgress.completedLessons.find(l => l.week === weekNum && l.lessonIndex === lessonIndex);
        if (!lesson) return false;
        if (isExam) return true;
        return (lesson.score || 0) >= 0; // Changed to 0 to allow any score for now, strictly > 0 if needed
    };

    const isWeekFullyCompleted = (weekNum: number) => {
        // Week is done if the last item (Simulado, index 10) is done
        return checkLessonCompletion(weekNum, 10, true);
    };

    // Helper to check if a whole DAY is completed - Used for inter-day locking
    const isDayCompleted = (weekNum: number, dayNum: number) => {
        if (dayNum === 6) return checkLessonCompletion(weekNum, 10, true);
        const baseIndex = (dayNum - 1) * 2;
        return checkLessonCompletion(weekNum, baseIndex, false) && checkLessonCompletion(weekNum, baseIndex + 1, false);
    };

    if (!isLoaded) return null; // Or a loading spinner

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center relative overflow-x-hidden">

            {/* Header Fixed */}
            <div className="w-full bg-white dark:bg-slate-900 shadow-sm py-6 px-4 text-center z-20 sticky top-[72px]">
                <h1 className="text-xl font-extrabold text-slate-800 dark:text-white uppercase tracking-wide">
                    Trilha Completa
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">40 Semanas • 240 Aulas</p>
            </div>

            {/* Timeline Container */}
            <div className="w-full max-w-md p-6 pt-32 pb-32 relative flex flex-col items-center">

                {/* Vertical Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-200 dark:bg-slate-800 border-l border-dashed border-slate-300 dark:border-slate-700 -translate-x-1/2 z-0"></div>

                {curriculum.map((week, weekIndex) => {
                    const isWeekUnlocked = week.weekNumber === 1 || isWeekFullyCompleted(week.weekNumber - 1);
                    const weekLockMessage = "Conclua todas as tarefas da semana anterior para acessar esta semana.";

                    return (
                        <div key={week.weekNumber} className={`w-full flex flex-col items-center mb-16 z-10 ${!isWeekUnlocked ? 'opacity-50 grayscale' : ''}`}>

                            {/* Week Header */}
                            <div className={`
                                group relative bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 w-full py-4 text-center mb-10 z-10
                                ${!isWeekUnlocked ? 'cursor-not-allowed' : ''}
                            `}>
                                <span className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">SEMANA {week.weekNumber}</span>

                                {/* Week Lock Tooltip */}
                                {!isWeekUnlocked && (
                                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[250px] bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 text-center pointer-events-none">
                                        {weekLockMessage}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                                    </div>
                                )}
                            </div>

                            {/* Days Grid */}
                            <div className="w-full flex flex-col gap-16 relative">
                                {week.days.map((dayItem: any, dayIndex: number) => {
                                    const Icon = dayItem.icon;

                                    return (
                                        <div key={dayItem.day} className="flex flex-col items-center w-full">

                                            {/* Day Header */}
                                            <div className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-10 shadow-sm z-10">
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{dayItem.title}</span>
                                            </div>

                                            {/* Lessons for the Day */}
                                            <div className="w-full flex flex-col gap-12 relative items-center">
                                                {dayItem.lessons.map((lesson: any, lIdx: number) => {
                                                    // Determine Lock State
                                                    let isLessonUnlocked = false;
                                                    let lockMessage = "";

                                                    if (!isWeekUnlocked) {
                                                        isLessonUnlocked = false;
                                                        lockMessage = weekLockMessage;
                                                    } else {
                                                        if (dayItem.day === 1 && lesson.lessonIndex === 0) {
                                                            isLessonUnlocked = true;
                                                        } else {
                                                            // Inter-Day Locking
                                                            const prevDayCompleted = dayItem.day === 1 ? true : isDayCompleted(week.weekNumber, dayItem.day - 1);
                                                            if (!prevDayCompleted) {
                                                                isLessonUnlocked = false;
                                                                lockMessage = "Conclua todas as aulas do dia anterior para acessar este dia.";
                                                            } else {
                                                                // Intra-Day Locking (Lesson 2 needs Lesson 1)
                                                                if (lesson.type === 'exam') {
                                                                    isLessonUnlocked = true;
                                                                } else {
                                                                    if (lesson.label === "AULA 1") {
                                                                        isLessonUnlocked = true;
                                                                    } else {
                                                                        const prevLessonDone = checkLessonCompletion(week.weekNumber, lesson.lessonIndex - 1, false);
                                                                        if (prevLessonDone) {
                                                                            isLessonUnlocked = true;
                                                                        } else {
                                                                            isLessonUnlocked = false;
                                                                            lockMessage = "Conclua a primeira aula do dia para acessar esta aula.";
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }

                                                    // Completion State
                                                    const completionData = userProgress.completedLessons.find(l => l.week === week.weekNumber && l.lessonIndex === lesson.lessonIndex);
                                                    const isCompleted = !!completionData;

                                                    // Determine Styles based on State
                                                    let bubbleClasses = "border-slate-100 bg-slate-100 dark:bg-slate-800 dark:border-slate-800 text-slate-300 dark:text-slate-600"; // Locked Default
                                                    let iconColorClass = "text-slate-300 dark:text-slate-600";

                                                    if (isCompleted) {
                                                        // ORANGE for Completed
                                                        bubbleClasses = "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30";
                                                        iconColorClass = "text-white";
                                                    } else if (isLessonUnlocked) {
                                                        // GREEN for Current / Unlocked & Not Completed
                                                        bubbleClasses = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30 ring-4 ring-green-500/10";
                                                        iconColorClass = "text-white";
                                                    }

                                                    return (
                                                        <div key={lesson.lessonIndex} className="relative flex w-full justify-center">

                                                            <Link
                                                                href={isLessonUnlocked ? `/enemsim/week/${week.weekNumber}/day/${lesson.lessonIndex + 1}` : "#"}
                                                                className={`relative group flex flex-col items-center select-none ${isLessonUnlocked ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-not-allowed opacity-80'}`}
                                                                onClick={(e) => !isLessonUnlocked && e.preventDefault()}
                                                            >
                                                                {/* Circle Node */}
                                                                <div className={`
                                                                    w-24 h-24 rounded-full flex items-center justify-center relative z-20 border-[6px] transition-all duration-300
                                                                    ${bubbleClasses}
                                                                `}>
                                                                    {isCompleted ? (
                                                                        <CheckCircle className={`w-10 h-10 ${iconColorClass}`} />
                                                                    ) : (
                                                                        // Show Icon. If Locked, gray. If Unlocked (Green), White.
                                                                        <Icon className={`w-10 h-10 ${iconColorClass}`} />
                                                                    )}
                                                                </div>

                                                                {/* Label Pill (AULA 1) */}
                                                                <div className={`
                                                                    -mt-4 px-4 py-1 rounded-full shadow-md z-30 mb-1 border border-slate-100 dark:border-slate-700
                                                                    bg-white dark:bg-slate-800
                                                                `}>
                                                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{lesson.label}</span>
                                                                </div>

                                                                {/* Subject Text */}
                                                                <span className={`text-sm font-bold max-w-[120px] text-center leading-tight mt-1
                                                                    ${isLessonUnlocked ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}
                                                                `}>
                                                                    {dayItem.subject}
                                                                </span>

                                                            </Link>

                                                            {/* Lesson Lock Tooltip */}
                                                            {!isLessonUnlocked && lockMessage && (
                                                                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[220px] bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 text-center pointer-events-none">
                                                                    {lockMessage}
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-slate-800"></div>
                                                                </div>
                                                            )}
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
                })}
            </div>
        </div>
    );
}
