"use client";

import { useState, useEffect } from "react";
import { Folder, Video, FileText, Upload, Save, CheckCircle, AlertCircle, ShieldAlert, Lock, Medal, Users, Calendar, BarChart3, PieChart } from "lucide-react";

// Mock Data Structure
// 1. Helper to generate consistent data
const generateAdminData = () => {
    // ... (rest of generateAdminData - kept same, implicitly)
    const data = [];

    // --- ENEMSIM (40 Weeks) ---
    const enemDays = [
        { id: 1, title: "Dia 1: Humanas" },
        { id: 2, title: "Dia 2: Linguagens" },
        { id: 3, title: "Dia 3: Natureza" },
        { id: 4, title: "Dia 4: Matemática" },
        { id: 5, title: "Dia 5: Redação" },
    ];

    for (let i = 1; i <= 40; i++) {
        data.push({
            id: i,
            title: `Semana ${i}`,
            type: 'ENEM',
            days: enemDays.map(d => ({
                id: d.id, // Simple ID: 1, 2, 3, 4, 5
                title: d.title
            }))
        });
    }

    // --- CONCURSIM (50 Modules) ---
    const concursoSubjects = [
        "Ética e Cidadania", "Atualidades", "Informática", "Dir. Constitucional",
        "Dir. Administrativo", "Raciocínio Lógico", "Matemática", "Português", "Redação"
    ];

    for (let i = 1; i <= 50; i++) {
        data.push({
            id: 100 + i, // 101 to 150
            title: `Módulo ${i}`,
            type: 'CONCURSO',
            days: concursoSubjects.map((subj, idx) => ({
                id: idx + 1, // Simple ID
                title: `${idx + 1}. ${subj}`
            }))
        });
    }

    return data;
};

const weeks = generateAdminData();

// Stats Card Component
const StatsCard = ({ title, count, icon, color }: any) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{count}</h3>
        </div>
    </div>
);

export default function AdminPage() {
    const [selectedContext, setSelectedContext] = useState<'ENEM' | 'CONCURSO'>('ENEM'); // Context Switcher
    const [selectedWeek, setSelectedWeek] = useState(weeks[0].id);
    const [selectedDay, setSelectedDay] = useState(weeks[0].days[0].id);
    const [selectedLesson, setSelectedLesson] = useState(1); // 1 or 2
    const [activeTab, setActiveTab] = useState<'CONTENT' | 'SECURITY'>('CONTENT');

    // Security State
    const [newPassword, setNewPassword] = useState("");
    const [adminList, setAdminList] = useState<any[]>([]);

    // Stats State
    const [stats, setStats] = useState({ today: 0, week: 0, month: 0, year: 0 });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("http://localhost:3002/admin/stats");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    // Content State (Restored)
    // Content State (Restored)
    const [videoUrl, setVideoUrl] = useState("");
    const [pdfName, setPdfName] = useState("");
    const [pdfUrl, setPdfUrl] = useState("");
    const [pdf2Name, setPdf2Name] = useState(""); // Second PDF
    const [pdf2Url, setPdf2Url] = useState("");   // Second PDF URL
    const [quizText, setQuizText] = useState(""); // Changed from File to String
    const [quizTextSuperior, setQuizTextSuperior] = useState(""); // New: Superior Level for Concursim
    const [parsedPreview, setParsedPreview] = useState<any[]>([]);
    const [isSaved, setIsSaved] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch existing content when selection changes
    useEffect(() => {
        const fetchContent = async () => {
            setVideoUrl("");
            setPdfName("");
            setPdfUrl("");
            setPdf2Name("");
            setPdf2Url("");
            setQuizText("");
            setQuizTextSuperior("");

            try {
                const res = await fetch(`http://localhost:3002/content?weekId=${selectedWeek}&dayId=${selectedDay}&lessonId=${selectedLesson}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.found && data.data) {
                        setVideoUrl(data.data.videoUrl || "");
                        setPdfName(data.data.pdfName || "");
                        setPdfUrl(data.data.pdfUrl || "");
                        setPdf2Name(data.data.pdf2Name || "");
                        setPdf2Url(data.data.pdf2Url || "");

                        // Convert questions back to text format for editing if needed
                        // This is tricky as we store structured data. For now, we might just leave the text empty 
                        // or try to reconstruct it. For simplicity in this fix, we won't auto-fill the text area 
                        // to avoid format mismatch, BUT users should know they might overwrite if they paste new text.
                        // Ideally, we would reconstruct the text representation.
                        if (data.data.questions && data.data.questions.length > 0) {
                            const qText = data.data.questions.map((q: any, index: number) =>
                                `${index + 1}. ${q.text}\n${q.options.map((o: string, i: number) =>
                                    `${String.fromCharCode(97 + i)}) ${o}`
                                ).join('\n')}\nResposta: ${String.fromCharCode(65 + q.correctAnswer)}\nComentário: ${q.justification}`
                            ).join('\n\n');
                            setQuizText(qText);
                        }

                        // Load Superior Questions (Concursim)
                        if (data.data.questionsSuperior && data.data.questionsSuperior.length > 0) {
                            const qTextSup = data.data.questionsSuperior.map((q: any, index: number) =>
                                `${index + 1}. ${q.text}\n${q.options.map((o: string, i: number) =>
                                    `${String.fromCharCode(97 + i)}) ${o}`
                                ).join('\n')}\nResposta: ${String.fromCharCode(65 + q.correctAnswer)}\nComentário: ${q.justification}`
                            ).join('\n\n');
                            setQuizTextSuperior(qTextSup);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch content", error);
            }
        };
        if (activeTab === 'CONTENT') {
            fetchContent();
        }
    }, [selectedWeek, selectedDay, selectedLesson, activeTab, selectedContext]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isSecondPdf = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        if (isSecondPdf) setPdf2Name(file.name);
        else setPdfName(file.name);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/upload`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                if (isSecondPdf) {
                    setPdf2Url(data.url);
                } else {
                    setPdfUrl(data.url);
                }
            } else {
                const errData = await res.json().catch(() => ({ error: res.statusText }));
                alert(`Erro no upload: ${errData.error || res.statusText} (${res.status})`);
            }
        } catch (error: any) {
            console.error("Upload Error:", error);
            alert(`Erro ao enviar arquivo: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };


    const handleSave = async () => {
        try {
            // Validate Quiz Text if present
            let parsedQuestions = [];
            if (quizText.trim()) {
                try {
                    parsedQuestions = parseQuizText(quizText);
                } catch (e: any) {
                    alert(e.message);
                    return; // Stop save
                }
            }

            // Validate Quiz Text Superior if present (Concursim)
            let parsedQuestionsSuperior = [];
            if (selectedContext === 'CONCURSO' && quizTextSuperior.trim()) {
                try {
                    parsedQuestionsSuperior = parseQuizText(quizTextSuperior);
                } catch (e: any) {
                    alert("Erro no Nível Superior: " + e.message);
                    return; // Stop save
                }
            }

            const payload = {
                weekId: selectedContext === 'ENEM' ? selectedWeek : selectedWeek,
                dayId: selectedContext === 'ENEM' ? selectedDay : selectedDay,
                lessonId: selectedContext === 'ENEM' ? selectedLesson : 1,
                data: {
                    videoUrl,
                    pdfName,
                    pdfUrl,
                    pdf2Name,
                    pdf2Url,
                    questions: parsedQuestions,
                    questionsSuperior: parsedQuestionsSuperior
                }
            };

            const res = await fetch('http://localhost:3002/admin/weeks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                if (!quizText.trim()) {
                    alert("Questões APAGADAS com sucesso!");
                } else {
                    setIsSaved(true);
                    setTimeout(() => setIsSaved(false), 3000);
                    // Improved Feedback
                    const targetName = selectedContext === 'ENEM' ? `Semana ${selectedWeek}, Dia ${selectedDay}` : `Módulo ${selectedWeek - 100}, Aula ${selectedDay}`;
                    alert(`Salvo com sucesso em: ${targetName}`);
                }
            } else {
                alert("Erro ao salvar!");
            }
        } catch (e) {
            console.error(e);
            alert("Erro de conexão");
        }
    };

    const handleDeleteQuestions = async () => {
        if (!confirm('Tem certeza que deseja apagar todas as questões desta aula do banco de dados? Esta ação é irreversível.')) return;

        try {
            const payload = {
                weekId: selectedContext === 'ENEM' ? selectedWeek : selectedWeek,
                dayId: selectedContext === 'ENEM' ? selectedDay : selectedDay,
                lessonId: selectedContext === 'ENEM' ? selectedLesson : 1,
                data: {
                    videoUrl, // Keep existing if possible, or just merge questions: []
                    pdfName,
                    pdfUrl,
                    questions: [] // Explicitly clear questions
                }
            };

            const res = await fetch('http://localhost:3002/admin/weeks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setQuizText(""); // Clear UI
                alert("Questões APAGADAS com sucesso!");
            } else {
                alert("Erro ao apagar questões!");
            }
        } catch (e) {
            console.error(e);
            alert("Erro de conexão");
        }
    };

    // Helper to parse text to questions mock JSON
    const parseQuizText = (text: string): any[] => {
        const lines = text.split('\n');
        const questions: any[] = [];
        let currentQuestion: any = null;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // 1. Detect Question Start (e.g., "1. Enunciado...", "1) ...", "1- ...", "QUESTÃO 1...")
            // Matches: "1.", "1)", "1-", "QUESTÃO 1", "Questão 01", etc.
            if (/^(?:QUESTÃO|QUESTAO|Questão|Questao)?\s*\d+[\.\-\)]?\s*/.test(line)) {

                // Heuristic: If it looks like a question start, check if it's not just a number in text
                // We enforce that if it starts with number, it must have a dot/paren OR be "QUESTÃO X"
                const isExplicitQuestionLabel = /^(?:QUESTÃO|QUESTAO|Questão|Questao)/i.test(line);
                const isNumberList = /^\d+[\.\-\)]/.test(line);

                if (isExplicitQuestionLabel || isNumberList) {
                    if (currentQuestion) questions.push(currentQuestion);
                    const text = line.replace(/^(?:QUESTÃO|QUESTAO|Questão|Questao)?\s*\d+[\.\-\)]?\s*/i, '');
                    currentQuestion = {
                        id: questions.length + 1,
                        text: text,
                        options: [],
                        correctAnswer: 0,
                        justification: null // Initialize as null to track if we found the label
                    };
                    continue;
                }
            }

            // 2. Detect Options (e.g., "a) Opção...", "a. ...", "A) ...")
            if (/^[a-eA-E][\)\.]\s/.test(line)) {
                if (currentQuestion) {
                    const optText = line.replace(/^[a-eA-E][\)\.]\s*/, '');
                    currentQuestion.options.push(optText);
                }
                continue;
            }

            // 3. Detect Answer (e.g., "Resposta: A", "Gabarito: A", "Resposta correta: A")
            // CHECK FOR INLINE ANSWER (e.g., "d) Opção D Gabarito: D")
            const answerMatch = line.match(/(?:Resposta|Gabarito)(?:\s+correta)?\s*:\s*([a-eA-E])/i);
            if (answerMatch && currentQuestion) {
                const map: { [key: string]: number } = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 };
                const letter = answerMatch[1].toLowerCase();
                if (map[letter] !== undefined) {
                    currentQuestion.correctAnswer = map[letter];

                    // If this line WAS an option, we need to clean the answer text from it
                    // If it started with an option prefix
                    if (/^[a-eA-E][\)\.]\s/.test(line)) {
                        // It was caught by step 2, but step 2 just pushed the raw line. 
                        // We need to fix the last pushed option.
                        if (currentQuestion.options.length > 0) {
                            const lastOptIdx = currentQuestion.options.length - 1;
                            // Remove the answer part from the option text
                            currentQuestion.options[lastOptIdx] = currentQuestion.options[lastOptIdx].replace(/(?:Resposta|Gabarito)(?:\s+correta)?\s*:\s*[a-eA-E].*/i, '').trim();
                        }
                    }
                }
            }

            // 4. Detect Justification (e.g., "Comentário: ...", "Justificativa: ...")
            // CHECK FOR INLINE JUSTIFICATION
            const justMatch = line.match(/(?:Comentário|Justificativa)\s*:\s*(.*)/i);
            if (justMatch && currentQuestion) {
                currentQuestion.justification = justMatch[1].trim();

                // If this line WAS an option, clean it
                if (/^[a-eA-E][\)\.]\s/.test(line) && currentQuestion.options.length > 0) {
                    const lastOptIdx = currentQuestion.options.length - 1;
                    // Remove the justification part from the option text
                    // Note: If Answer was also there, it's already removed/handled or we need to be careful with order.
                    // Usually Answer comes before Justification or together.
                    // The regex above `(.*)` captures everything after "Comentário:", so we just need to remove "Comentário: ..." from option.
                    currentQuestion.options[lastOptIdx] = currentQuestion.options[lastOptIdx].replace(/(?:Comentário|Justificativa)\s*:\s*.*/i, '').trim();
                }
                continue; // Justification usually ends the block for this line's processing of "new" types, but might continue on next line
            }

            // If we found a standalone answer line (old logic), we still want to skip adding it as text
            if (/^(?:Resposta|Gabarito)(?:\s+correta)?\s*:/i.test(line)) {
                continue;
            }

            // 5. Continuation (Multi-line text)
            // If we are here, it's not a start of anything, so append to previous context
            if (currentQuestion) {
                if (currentQuestion.justification !== null) {
                    // Check if we just started justification or adding more lines
                    // If existing justification is empty (parsed from same line), assumes split line
                    currentQuestion.justification += " " + line;
                }
                else if (currentQuestion.options.length > 0) {
                    // Appends to the last option if options exist
                    currentQuestion.options[currentQuestion.options.length - 1] += " " + line;
                }
                else {
                    // Appends to question text
                    currentQuestion.text += " " + line;
                }
            }
        }
        if (currentQuestion) questions.push(currentQuestion);

        // STRICT ENFORCEMENT
        if (questions.length !== 15) {
            throw new Error(`O texto contém ${questions.length} questões identificadas. É obrigatório ter EXATAMENTE 15 questões. (Verifique se o formato "QUESTÃO X" ou "1." está correto).`);
        } else {
            return questions;
        }
    };



    useEffect(() => {
        if (activeTab === 'SECURITY') {
            fetchAdmins();
        }
    }, [activeTab]);

    const fetchAdmins = async () => {
        try {
            const res = await fetch('http://localhost:3001/admin/users');
            if (res.ok) {
                const data = await res.json();
                setAdminList(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleChangePassword = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        try {
            const res = await fetch('http://localhost:3001/auth/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, newPassword })
            });
            if (res.ok) alert('Senha alterada com sucesso!');
            else alert('Erro ao alterar senha');
        } catch (e) {
            alert('Erro de conexão');
        }
    };

    const toggleBlockUser = async (id: number, currentStatus: boolean) => {
        try {
            const res = await fetch(`http://localhost:3001/admin/users/${id}/block`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isBlocked: !currentStatus })
            });
            if (res.ok) fetchAdmins();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleAuthority = async (id: number, currentStatus: boolean) => {
        try {
            const res = await fetch(`http://localhost:3001/admin/users/${id}/authority`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ canApprove: !currentStatus })
            });
            if (res.ok) fetchAdmins();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 border-b pb-4 border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Folder className="w-8 h-8 text-blue-600" />
                            Painel Administrativo
                        </h1>
                        <p className="text-gray-500">Gerenciamento de Conteúdo e Aulas</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('CONTENT')}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'CONTENT' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600'}`}
                        >
                            Conteúdo
                        </button>
                        <button
                            onClick={() => setActiveTab('SECURITY')}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'SECURITY' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600'}`}
                        >
                            Segurança
                        </button>
                    </div>
                </div>

                {/* VISITOR ANALYTICS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatsCard title="Hoje" count={stats.today} icon={<Users className="w-6 h-6 text-blue-600" />} color="bg-blue-50 text-blue-600" />
                    <StatsCard title="Esta Semana" count={stats.week} icon={<Calendar className="w-6 h-6 text-purple-600" />} color="bg-purple-50 text-purple-600" />
                    <StatsCard title="Este Mês" count={stats.month} icon={<BarChart3 className="w-6 h-6 text-green-600" />} color="bg-green-50 text-green-600" />
                    <StatsCard title="Este Ano" count={stats.year} icon={<PieChart className="w-6 h-6 text-orange-600" />} color="bg-orange-50 text-orange-600" />
                </div>

                {activeTab === 'SECURITY' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Change Password */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-blue-500" />
                                Alterar Minha Senha
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Nova Senha</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        placeholder="Digite a nova senha..."
                                    />
                                </div>
                                <button
                                    onClick={handleChangePassword}
                                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                >
                                    Atualizar Senha
                                </button>
                            </div>
                        </div>

                        {/* Manage Admins */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-red-500" />
                                Gestão de Administradores
                            </h2>
                            <div className="space-y-3">
                                {adminList.map(admin => (
                                    <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">{admin.name || 'Sem nome'}</p>
                                            <p className="text-xs text-gray-500">{admin.email}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleBlockUser(admin.id, admin.isBlocked)}
                                            className={`px-3 py-1 text-xs font-bold rounded-full ${admin.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                                        >
                                            {admin.isBlocked ? 'BLOQUEADO' : 'ATIVO'}
                                        </button>
                                    </div>
                                ))}
                                {adminList.length === 0 && <p className="text-gray-500 text-center">Nenhum outro admin encontrado.</p>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar: Navigation */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 h-fit">

                            {/* Context Switcher */}
                            <div className="mb-6 p-2 bg-gray-100 dark:bg-slate-800 rounded-lg flex gap-1">
                                <button
                                    onClick={() => setSelectedContext('ENEM')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${selectedContext === 'ENEM' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    ENEM
                                </button>
                                <button
                                    onClick={() => setSelectedContext('CONCURSO')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${selectedContext === 'CONCURSO' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    CONCURSO
                                </button>
                            </div>

                            <h2 className="font-bold text-slate-700 dark:text-gray-200 mb-4 px-2">
                                {selectedContext === 'ENEM' ? 'Semanas de Estudo' : 'Módulos do Curso'}
                            </h2>
                            <div className="space-y-4">
                                {weeks.filter(w => w.type === selectedContext).map(week => (
                                    <div key={week.id}>
                                        <div
                                            onClick={() => setSelectedWeek(week.id)}
                                            className={`p-2 rounded-lg cursor-pointer font-medium ${selectedWeek === week.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                        >
                                            {week.title}
                                        </div>
                                        {selectedWeek === week.id && (
                                            <div className="ml-4 mt-2 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 pl-2">
                                                {week.days.map(day => (
                                                    <div
                                                        key={day.id}
                                                        onClick={() => setSelectedDay(day.id)}
                                                        className={`text-sm p-2 rounded-md cursor-pointer ${selectedDay === day.id ? 'text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}`}
                                                    >
                                                        {day.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Content: Edit Form */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Selector tabs for Lesson 1 / Lesson 2 (Only for Days 1-5 of ENEM) */}
                            {selectedContext === 'ENEM' && selectedDay !== 6 && (
                                <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                                    <button
                                        onClick={() => setSelectedLesson(1)}
                                        className={`flex-1 py-2 font-bold rounded-md transition-all ${selectedLesson === 1 ? 'bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Aula 1
                                    </button>
                                    <button
                                        onClick={() => setSelectedLesson(2)}
                                        className={`flex-1 py-2 font-bold rounded-md transition-all ${selectedLesson === 2 ? 'bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Aula 2
                                    </button>
                                </div>
                            )}

                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 p-2 rounded-lg text-sm">
                                        DIA {selectedDay} / {(selectedContext === 'ENEM' && selectedDay === 6) ? 'SIMULADO' : `AULA ${selectedContext === 'ENEM' ? selectedLesson : 1}`}
                                    </span>
                                    Configuração da Aula
                                </h2>

                                {(selectedContext === 'ENEM' && selectedDay === 6) ? (
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">Simulado Semanal (Dia 6)</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">O simulado é gerado automaticamente a partir das questões cadastradas nos dias anteriores.</p>
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                                            <strong>Nota:</strong> Não é necessário cadastrar conteúdo específico para o Dia 6. Certifique-se apenas de cadastrar perguntas nos Dias 1 a 5.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* 1. Video URL */}
                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <Video className="w-5 h-5 text-red-500" />
                                                Link do Vídeo (YouTube)
                                            </label>
                                            <input
                                                type="text"
                                                value={videoUrl}
                                                onChange={(e) => setVideoUrl(e.target.value)}
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="w-full p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <p className="text-xs text-gray-500 mt-2 ml-2">Cole o link completo ou o ID do vídeo.</p>
                                        </div>

                                        {/* 2. PDF Upload */}
                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-orange-500" />
                                                Material de Apoio (PDF)
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950/50 hover:bg-gray-100 transition-colors cursor-pointer relative group">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleFileUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <Upload className={`w-10 h-10 mb-2 ${isUploading ? 'text-blue-500 animate-bounce' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                <p className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-blue-500">
                                                    {isUploading ? "Enviando..." : pdfName ? pdfName : "Clique ou arraste o PDF aqui"}
                                                </p>
                                                {pdfUrl && !isUploading && <p className="text-xs text-green-500 mt-2">Arquivo carregado e vinculado com sucesso</p>}
                                                {pdfName && !pdfUrl && !isUploading && (
                                                    <p className="text-xs text-red-500 mt-2 font-bold animate-pulse">
                                                        ⚠ Nome existe, mas o arquivo não! Faça o upload novamente.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* 2.1 Second PDF Upload (Specific for Day 2 Lesson 2 OR Day 4 Lesson 1 OR Day 5 Lesson 2) */}
                                        {((selectedContext === 'ENEM' && selectedDay === 2 && selectedLesson === 2) || (selectedContext === 'ENEM' && selectedDay === 4 && selectedLesson === 1) || (selectedContext === 'ENEM' && selectedDay === 5 && selectedLesson === 2)) && (
                                            <div>
                                                <label className="block font-bold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-purple-500" />
                                                    {(() => {
                                                        if (selectedDay === 2) return "PDF: Análise Literária (P/ Aula 2)";
                                                        if (selectedDay === 4) return "PDF: MACETES DE MATEMÁTICA (P/ Aula 1)";
                                                        return "PDF: Redação Nota 1000 (P/ Aula 2)";
                                                    })()}
                                                </label>
                                                <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950/50 hover:bg-gray-100 transition-colors cursor-pointer relative group">
                                                    <input
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => handleFileUpload(e, true)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <Upload className={`w-10 h-10 mb-2 ${isUploading ? 'text-blue-500 animate-bounce' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                    <p className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-blue-500">
                                                        {isUploading ? "Enviando..." : pdf2Name ? pdf2Name : "Clique ou arraste o Segundo PDF aqui"}
                                                    </p>
                                                    {pdf2Url && !isUploading && <p className="text-xs text-green-500 mt-2">Arquivo carregado e vinculado com sucesso</p>}
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. Questions Text Input */}
                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                Banco de Questões (Colar Texto)
                                            </label>
                                            <div className="flex justify-end gap-2 mb-2">
                                                <button
                                                    onClick={() => setQuizText("1. Exemplo de pergunta...\na) Opção A\nb) Opção B\nc) Opção C\nd) Opção D\ne) Opção E\nResposta: A\nComentário: Explicação aqui...")}
                                                    className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
                                                >
                                                    Colar Exemplo
                                                </button>
                                                <button
                                                    onClick={handleDeleteQuestions}
                                                    className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors border border-red-200"
                                                >
                                                    Excluir Questões do Banco
                                                </button>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-xl border border-gray-200 dark:border-slate-800">
                                                <textarea
                                                    value={quizText}
                                                    onChange={(e) => setQuizText(e.target.value)}
                                                    placeholder="Cole aqui as 15 questões seguindo o formato:&#10;1. Enunciado...&#10;a) Opção A&#10;b) Opção B...&#10;Resposta: A&#10;Comentário: ..."
                                                    className="w-full h-96 p-4 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                                />
                                                <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                                                    <span>Total de caracteres: {quizText.length}</span>
                                                    <span className="text-green-600 font-bold">
                                                        Formato: 1. Pergunta | a) Opção | Resposta: X | Comentário: ...
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 4. Questions Text Input (SUPERIOR - Only for Concursim) */}
                                        {selectedContext === 'CONCURSO' && (
                                            <div className="mt-8 border-t pt-8 border-slate-200 dark:border-slate-800">
                                                <label className="block font-bold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                    <Medal className="w-5 h-5 text-purple-500" />
                                                    Banco de Questões - Nível Superior (Opcional)
                                                </label>
                                                <div className="flex justify-end gap-2 mb-2">
                                                    <button
                                                        onClick={() => setQuizTextSuperior("1. Pergunta Complexa...\na) Opção A\nb) Opção B\nc) Opção C\nd) Opção D\ne) Opção E\nResposta: A\nComentário: Análise aprofundada...")}
                                                        className="text-xs px-3 py-1 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 font-medium transition-colors"
                                                    >
                                                        Colar Exemplo Superior
                                                    </button>
                                                </div>
                                                <div className="bg-purple-50 dark:bg-slate-950/50 p-4 rounded-xl border border-purple-200 dark:border-slate-800">
                                                    <textarea
                                                        value={quizTextSuperior}
                                                        onChange={(e) => setQuizTextSuperior(e.target.value)}
                                                        placeholder="Cole aqui as 15 questões de Nível Superior..."
                                                        className="w-full h-96 p-4 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                                    />
                                                    <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                                                        <span>Total de caracteres: {quizTextSuperior.length}</span>
                                                        <span className="text-purple-600 font-bold">
                                                            Mesmo formato do nível médio.
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={handleSave}
                                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
                                            >
                                                {isSaved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                                {isSaved ? "Salvo com Sucesso!" : "Salvar Configurações"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
