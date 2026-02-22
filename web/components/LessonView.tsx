"use client";

import { useState, useEffect } from "react";
import { PlayCircle, FileText, CheckCircle, Lock, RotateCcw } from "lucide-react";
import AdBanner from "./AdBanner";
import { Browser } from '@capacitor/browser';

interface LessonData {
    videoUrl?: string;
    pdfName?: string;
    pdfUrl?: string;
    pdf2Name?: string;
    pdf2Url?: string;
    questions?: any[];
}

interface LessonViewProps {
    lessonNumber: number;
    title: string;
    description: string;
    isLocked: boolean;
    data: LessonData | null;
    onComplete: () => void;
    weekId: string;
    dayId: string;
    onNextStep: () => void;
    initialCompleted?: boolean;
    pdfButtonLabel?: string;
    pdf2Label?: string;
}

export default function LessonView({
    lessonNumber,
    title,
    description,
    isLocked,
    data,
    onComplete,
    weekId,
    dayId,
    onNextStep,
    initialCompleted,
    pdfButtonLabel,
    pdf2Label
}: LessonViewProps) {
    const [isCompleted, setIsCompleted] = useState(initialCompleted || false);

    useEffect(() => {
        if (initialCompleted) {
            setIsCompleted(true);
        }
    }, [initialCompleted]);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5);
    const [isWaitingNext, setIsWaitingNext] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackTimeLeft, setFeedbackTimeLeft] = useState(5);
    const [isPdfOpen, setIsPdfOpen] = useState(false);

    const questions = (data?.questions || []).slice(0, 15);
    const hasQuiz = questions.length > 0;

    useEffect(() => {
        if (isCompleted || showFeedback || !hasQuiz) return;
        setTimeLeft(5);
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentQuestion, isCompleted, showFeedback, hasQuiz]);

    useEffect(() => {
        if (!showFeedback) return;
        setFeedbackTimeLeft(5);
        const timer = setInterval(() => {
            setFeedbackTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [showFeedback]);

    const handleConfirmAnswer = () => {
        if (isWaitingNext) return;
        setIsWaitingNext(true);
        if (selectedAnswer === questions[currentQuestion].correctAnswer) {
            setScore(prev => prev + 1);
        }
        setTimeout(() => {
            setShowFeedback(true);
            setIsWaitingNext(false);
        }, 1000);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        } else {
            setIsCompleted(true);
            setShowFeedback(false);
            onComplete();
        }
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        try {
            if (url.includes("youtu.be/")) {
                const id = url.split("youtu.be/")[1]?.split("?")[0];
                return `https://www.youtube.com/embed/${id}`;
            }
            if (url.includes("watch?v=")) {
                const id = url.split("v=")[1]?.split("&")[0];
                return `https://www.youtube.com/embed/${id}`;
            }
            return url;
        } catch (e) {
            return url;
        }
    };

    const resolvePdfUrl = (url: string) => {
        if (!url) return "";
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-enemsim.onrender.com';
        let targetUrl = url;

        if (url.startsWith('/')) {
            targetUrl = `${apiUrl}${url}`;
        } else if (url.includes('localhost')) {
            targetUrl = url.replace(/http:\/\/localhost:\d+/, apiUrl);
        }

        if (targetUrl.startsWith('http')) {
            return `https://docs.google.com/viewer?url=${encodeURIComponent(targetUrl)}&embedded=true`;
        }
        return targetUrl;
    };

    const openExternalPdf = async (url: string) => {
        let rawUrl = url;
        if (url.includes('docs.google.com')) {
            const parts = url.split('url=');
            if (parts[1]) {
                rawUrl = decodeURIComponent(parts[1].split('&')[0]);
            }
        }
        await Browser.open({ url: rawUrl });
    };

    if (isLocked) {
        return (
            <div className={`w-full rounded-xl shadow-md overflow-hidden border transition-all bg-gray-100 dark:bg-slate-900 border-gray-300 dark:border-slate-800 opacity-80`}>
                <div className="p-4 flex items-center justify-between gap-3 bg-gray-400">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white">{title}</h2>
                    </div>
                </div>
                <div className="p-6 relative">
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center">
                        <Lock className="w-10 h-10 text-gray-500 mb-2" />
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-200">Aula Bloqueada</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Conclua a aula anterior para acessar esta aula.</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className={`p-4 flex items-center justify-between gap-3 bg-blue-600`}>
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                </div>
                {isCompleted && <CheckCircle className="w-6 h-6 text-white" />}
            </div>

            <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>

                {data?.videoUrl ? (
                    <div className="w-full aspect-video bg-black rounded-lg mb-6 overflow-hidden shadow-lg relative group cursor-pointer">
                        <iframe
                            className="w-full h-full"
                            src={getEmbedUrl(data.videoUrl)}
                            title={`Video Aula ${lessonNumber}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="w-full aspect-video bg-gray-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 mb-6">
                        <p>Vídeo não disponível</p>
                    </div>
                )}

                <div className="flex flex-col gap-2 mb-8">
                    <button
                        onClick={() => {
                            if (data?.pdfUrl) {
                                setIsPdfOpen(true);
                            } else {
                                alert("O arquivo PDF não foi encontrado.");
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        {data?.pdfName ? (pdfButtonLabel || `Ler Material: ${data.pdfName}`) : (pdfButtonLabel || "Ler Material (PDF)")}
                    </button>

                    {data?.pdf2Url && (
                        <button
                            onClick={() => openExternalPdf(data.pdf2Url || "")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 border border-purple-200 dark:border-purple-800 rounded-lg font-bold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                        >
                            <FileText className="w-5 h-5" />
                            {pdf2Label || "Material Extra (PDF)"}
                        </button>
                    )}

                    {isPdfOpen && data?.pdfUrl && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                            <div className="bg-white dark:bg-slate-900 w-full h-full max-w-5xl rounded-lg flex flex-col relative overflow-hidden">
                                <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-red-500" />
                                        Leitor de PDF
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openExternalPdf(resolvePdfUrl(data.pdfUrl || ""))}
                                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-bold text-xs transition-colors"
                                        >
                                            Abrir Externo ↗
                                        </button>
                                        <button
                                            onClick={() => setIsPdfOpen(false)}
                                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 flex items-center gap-2 font-bold text-sm transition-colors"
                                        >
                                            Fechar ✕
                                        </button>
                                    </div>
                                </div>
                                <iframe
                                    src={resolvePdfUrl(data.pdfUrl)}
                                    className="w-full flex-1 bg-gray-100"
                                    title="PDF Viewer"
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t pt-6 border-gray-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Questionário da Aula ({hasQuiz ? `${currentQuestion + 1}/${questions.length}` : "Indisponível"})
                    </h3>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-800 transition-all">
                        {!hasQuiz ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Nenhum questionário disponível para esta aula.</p>
                            </div>
                        ) : isCompleted ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Aula Concluída!</h3>
                                <div className="mb-6">
                                    <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mt-2">
                                        {Math.round((score / questions.length) * 100)}%
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Você acertou {score} de {questions.length} questões.
                                    </p>
                                </div>
                                <button
                                    onClick={onNextStep}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Próxima etapa liberada!
                                </button>
                                <button
                                    onClick={() => {
                                        setIsCompleted(false);
                                        setCurrentQuestion(0);
                                        setScore(0);
                                        setSelectedAnswer(null);
                                        setShowFeedback(false);
                                    }}
                                    className="w-full mt-3 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Refazer Questionário
                                </button>
                            </div>
                        ) : (
                            <>
                                {!showFeedback ? (
                                    <>
                                        <div className="w-full h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                                                style={{ width: `${(timeLeft / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider font-bold">Questão {currentQuestion + 1}</p>
                                        <p className="font-medium text-slate-800 dark:text-gray-200 text-lg mb-6 leading-relaxed">
                                            {questions[currentQuestion].text}
                                        </p>
                                        <div className="space-y-3 mb-6">
                                            {questions[currentQuestion].options.map((option: string, idx: number) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => !isWaitingNext && setSelectedAnswer(idx)}
                                                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${selectedAnswer === idx
                                                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 dark:bg-blue-900/30 dark:border-blue-400'
                                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-300'
                                                        } ${isWaitingNext ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === idx ? 'border-blue-500' : 'border-gray-300'}`}>
                                                        {selectedAnswer === idx && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                                                    </div>
                                                    <span className="text-slate-700 dark:text-gray-300">{option}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <AdBanner className="mb-6" />
                                        <button
                                            onClick={handleConfirmAnswer}
                                            disabled={timeLeft > 0 || selectedAnswer === null || isWaitingNext}
                                            className={`w-full py-3 font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 ${(timeLeft > 0 || selectedAnswer === null || isWaitingNext)
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-gray-600'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5'
                                                }`}
                                        >
                                            {isWaitingNext ? "Processando..." : timeLeft > 0 ? `Leia com atenção (${timeLeft}s)` : "Confirmar Resposta"}
                                        </button>
                                    </>
                                ) : (
                                    <div className="animate-in fade-in zoom-in duration-300">
                                        <div className={`p-6 rounded-xl mb-6 text-center border-2 ${selectedAnswer === questions[currentQuestion].correctAnswer
                                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                            }`}>
                                            {selectedAnswer === questions[currentQuestion].correctAnswer ? (
                                                <>
                                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <CheckCircle className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Resposta Correta!</h3>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <div className="text-3xl font-bold">X</div>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Resposta Incorreta</h3>
                                                </>
                                            )}
                                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                <strong>Justificativa:</strong> {questions[currentQuestion].justification}
                                            </p>
                                        </div>
                                        <div className="my-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                                            <AdBanner />
                                        </div>
                                        <button
                                            onClick={handleNextQuestion}
                                            disabled={feedbackTimeLeft > 0}
                                            className={`w-full py-3 font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 ${feedbackTimeLeft > 0
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-slate-800'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                                                }`}
                                        >
                                            {feedbackTimeLeft > 0 ? `Próxima Questão em ${feedbackTimeLeft}s...` : "Avançar para Próxima Questão"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
