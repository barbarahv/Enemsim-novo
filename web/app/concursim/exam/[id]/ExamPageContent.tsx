"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExamPageContent({ id }: { id: string }) {
    const router = useRouter();
    const [started, setStarted] = useState(false);

    // Data State
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Exam State
    const [currentQuestion, setCurrentQuestion] = useState(0); // 0-indexed for array access
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<Record<number, number>>({}); // Map question index to selected option index
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    // Fetch Questions
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/concursim-exam?moduleId=${id}`, { cache: 'no-store' });
                const json = await res.json();

                if (json.found && json.data && Array.isArray(json.data.questions)) {
                    setQuestions(json.data.questions);
                } else {
                    console.error("No questions found or invalid format");
                }
            } catch (e) {
                console.error("Failed to fetch exam:", e);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchExam();
        }
    }, [id]);

    const handleOptionSelect = (optionIdx: number) => {
        if (finished) return;
        setSelectedAnswer(optionIdx);
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: optionIdx
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            // Restore selection if already answered (though usually sequential, user might want to review if we enabled back button)
            const nextAnswer = answers[currentQuestion + 1];
            setSelectedAnswer(nextAnswer !== undefined ? nextAnswer : null);
        } else {
            finishExam();
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
            const prevAnswer = answers[currentQuestion - 1];
            setSelectedAnswer(prevAnswer !== undefined ? prevAnswer : null);
        }
    };

    const finishExam = () => {
        // Calculate Score
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setFinished(true);
        saveProgress(correctCount);
    };

    const saveProgress = (finalScore: number) => {
        // Concursim Progress Structure
        // Module ID
        // Lesson Index for "Simulado Final" = 9 (0-indexed, based on moduleSchedule in SubjectPageContent having 10 items)

        const lessonIndex = 9; // Simulado is the 10th item
        const stored = localStorage.getItem('concursimProgress');
        let progress = stored ? JSON.parse(stored) : { completedModules: [], completedLessons: [] };

        const existing = progress.completedLessons.find((l: any) => l.module === parseInt(id) && l.lessonIndex === lessonIndex);

        if (!existing) {
            const percentage = Math.round((finalScore / questions.length) * 100);

            progress.completedLessons.push({
                module: parseInt(id),
                lessonIndex: lessonIndex,
                score: percentage
            });

            // If passed (e.g. > 50%?), mark module as complete? 
            // For now just add to completedModules if not there
            if (!progress.completedModules.includes(parseInt(id))) {
                progress.completedModules.push(parseInt(id));
            }

            localStorage.setItem('concursimProgress', JSON.stringify(progress));

            // Sync with Backend
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/progress`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(progress)
                }).catch(console.error);
            }
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Carregando prova...</div>;
    }

    if (!started && !finished) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Simulado Final</h1>
                    <p className="text-gray-500 mb-6">Módulo {id}</p>

                    <div className="space-y-4 text-left bg-gray-50 dark:bg-slate-800 p-4 rounded-xl mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Questões:</span>
                            <span className="font-bold text-slate-800 dark:text-white">{questions.length > 0 ? questions.length : "Carregando..."}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Tempo estimado:</span>
                            <span className="font-bold text-slate-800 dark:text-white">3h 30min</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setStarted(true)}
                        disabled={questions.length === 0}
                        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {questions.length > 0 ? "Iniciar Simulado" : "Sem questões disponíveis"}
                    </button>

                    <Link href="/concursim" className="block mt-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
                        Voltar para Conteúdos
                    </Link>
                </div>
            </div>
        );
    }

    if (finished) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center gap-6 justify-center">
                <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 p-8 text-center">
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">Simulado Finalizado!</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">Nota Final: {Math.round((score / questions.length) * 100)}%</p>
                    <p className="mb-8 text-gray-500">Acertos: {score} / {questions.length}</p>
                    <Link href={`/concursim`} className="block w-full py-4 bg-green-600 text-white font-bold rounded-xl mb-4 hover:bg-green-700 transition-colors">
                        VOLTAR PARA O MAPA
                    </Link>
                </div>
            </div>
        );
    }

    const currentQData = questions[currentQuestion];
    const displayQuestionNumber = currentQuestion + 1;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
            {/* Header */}
            <div className="h-16 border-b dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-green-600">Questão {displayQuestionNumber}/{questions.length}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-sm">--:--</span>
                </div>
            </div>

            {/* Question Content */}
            <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
                <div className="mb-2">
                    <span className="text-xs font-bold tracking-wider text-green-600 uppercase bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                        Disciplina {currentQData?.subjectId || "Geral"}
                    </span>
                </div>

                <h2 className="text-lg font-medium text-slate-800 dark:text-white mb-6 leading-relaxed">
                    {currentQData?.text}
                </h2>

                <div className="space-y-3">
                    {currentQData?.options?.map((option: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 group
                                ${selectedAnswer === idx
                                    ? 'bg-green-50 border-green-500 ring-1 ring-green-500 dark:bg-green-900/30'
                                    : 'border-gray-200 dark:border-slate-800 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10'}
                            `}
                        >
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0
                                ${selectedAnswer === idx
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300 text-gray-500 group-hover:border-green-500 group-hover:text-green-600'}
                            `}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{option}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="p-4 border-t dark:border-slate-800 flex justify-between bg-white dark:bg-slate-900">
                <button
                    disabled={currentQuestion === 0}
                    onClick={handlePrevious}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    Anterior
                </button>

                <button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentQuestion === questions.length - 1 ? "Finalizar" : "Próxima"}
                </button>
            </div>
        </div>
    );
}
