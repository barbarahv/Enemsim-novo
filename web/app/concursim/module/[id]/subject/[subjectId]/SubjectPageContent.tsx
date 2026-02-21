"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import LessonView from "@/components/LessonView";

// Mock Data for Lesson Content (Simulating independent DB)
const mockLessonData = {
    title: "Aula de Demonstração",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=mock", // Mock Video
    pdfName: "Apostila_Modulo_1.pdf",
    questions: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        text: `Questão ${i + 1} de Concurso: Qual a alternativa correta segundo a banca?`,
        options: ["Alternativa A (Correta)", "Alternativa B", "Alternativa C", "Alternativa D"],
        correctAnswer: 0,
        justification: "Justificativa baseada na lei/doutrina específica para concursos."
    }))
};

// Recreated schedule to map IDs to next steps
const moduleSchedule = [
    { id: 1, subject: "Ética e Cidadania" },
    { id: 2, subject: "Atualidades" },
    { id: 3, subject: "Informática" },
    { id: 4, subject: "Direito Constitucional" },
    { id: 5, subject: "Direito Administrativo" },
    { id: 6, subject: "Raciocínio Lógico" },
    { id: 7, subject: "Matemática" },
    { id: 8, subject: "Português" },
    { id: 9, subject: "Redação" },
    { id: 10, subject: "Simulado Final", isExam: true },
];

export default function SubjectPageContent({ id, subjectId }: { id: string; subjectId: string }) {
    const router = useRouter();

    // Data Fetching State
    const [lessonData, setLessonData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Persistence State
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<'MEDIUM' | 'SUPERIOR'>('MEDIUM'); // Default to Medium

    // Fetch Content on Load
    useEffect(() => {
        const fetchContent = async () => {
            try {
                // For Concurso, weekId = module id, dayId = subject id
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content?weekId=${parseInt(id) + 100}&dayId=${subjectId}&lessonId=1`);
                const data = await res.json();

                if (data.found && data.data) {
                    setLessonData(data.data);
                }
            } catch (e) {
                console.error("Failed to fetch lesson content", e);
            } finally {
                setLoading(false);
            }
        };

        if (id && subjectId) {
            fetchContent();
        }
    }, [id, subjectId]);

    // Load Progress
    useEffect(() => {
        const stored = localStorage.getItem('concursimProgress');
        if (stored) {
            const progress = JSON.parse(stored);
            const currentItemIdx = moduleSchedule.findIndex(m => m.id === parseInt(subjectId));
            if (currentItemIdx !== -1) {
                const isDone = progress.completedLessons.some((l: any) => l.module === parseInt(id) && l.lessonIndex === currentItemIdx);
                if (isDone) setLessonCompleted(true);
            }
        }
    }, [id, subjectId]);

    const handleLessonComplete = () => {
        const currentItemIdx = moduleSchedule.findIndex(m => m.id === parseInt(subjectId));
        if (currentItemIdx === -1) return;

        // Save Progress
        const stored = localStorage.getItem('concursimProgress');
        let progress = stored ? JSON.parse(stored) : { completedModules: [], completedLessons: [] };

        const existing = progress.completedLessons.find((l: any) => l.module === parseInt(id) && l.lessonIndex === currentItemIdx);
        if (!existing) {
            progress.completedLessons.push({
                module: parseInt(id),
                lessonIndex: currentItemIdx,
                score: 100 // Assume completion = 100 or calculate from LessonView if we pass updated score back (not currently supported in handleNextStep arg)
            });
            localStorage.setItem('concursimProgress', JSON.stringify(progress));

            // Sync with Backend
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/progress`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(progress)
                }).catch(err => console.error("Failed to save progress to backend", err));
            }
        }

        // Navigate
        router.push(`/concursim`);
    };

    if (loading) return <div className="p-10 text-center">Carregando...</div>;

    const activeLessonData = lessonData || mockLessonData;

    // Select Questions based on Level
    const currentQuestions = selectedLevel === 'SUPERIOR'
        ? (activeLessonData.questionsSuperior || [])
        : (activeLessonData.questions || []);

    // Ensure 15 questions limit for display safety (though admin should enforce)
    const displayQuestions = currentQuestions.slice(0, 15);

    // Construct a temporary data object for LessonView
    const lessonViewData = {
        ...activeLessonData,
        questions: displayQuestions
    };

    // Determine titles
    const subjectInfo = moduleSchedule.find(m => m.id === parseInt(subjectId));
    const pageTitle = subjectInfo ? subjectInfo.subject : `Disciplina ${subjectId}`;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-3xl mb-6">
                <Link href="/concursim" className="text-green-600 flex items-center gap-1 hover:underline mb-4 font-bold">
                    <ArrowLeft className="w-4 h-4" /> Voltar para o Mapa
                </Link>
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">MÓDULO {id}</span>
                </div>
            </div>

            <div className="w-full max-w-3xl">
                {/* Level Selection Tabs */}
                <div className="flex mb-4 bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setSelectedLevel('MEDIUM')}
                        className={`flex-1 py-2 font-bold rounded-md transition-all text-sm ${selectedLevel === 'MEDIUM' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Nível Médio
                    </button>
                    <button
                        onClick={() => setSelectedLevel('SUPERIOR')}
                        className={`flex-1 py-2 font-bold rounded-md transition-all text-sm ${selectedLevel === 'SUPERIOR' ? 'bg-purple-50 text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Nível Superior
                    </button>
                </div>

                <LessonView
                    lessonNumber={parseInt(subjectId)}
                    title={`${pageTitle} - ${selectedLevel === 'MEDIUM' ? 'Nível Médio' : 'Nível Superior'}`}
                    description={`Conteúdo completo de ${pageTitle}.`}
                    isLocked={false}
                    data={lessonViewData}
                    onComplete={() => setLessonCompleted(true)}
                    onNextStep={handleLessonComplete}
                    initialCompleted={lessonCompleted}
                    weekId={id} // Using Module ID as weekId used only for logging/keys in LessonView for now
                    dayId={subjectId}
                />
            </div>

            <div className="pt-6 w-full max-w-3xl">
                <p className="text-center text-xs text-gray-400 mb-2">Publicidade</p>
                <AdBanner />
            </div>
        </div>
    );
}
