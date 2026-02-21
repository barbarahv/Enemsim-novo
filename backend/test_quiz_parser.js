
const parseQuizText = (text) => {
    const lines = text.split('\n');
    const questions = [];
    let currentQuestion = null;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (/^(?:QUESTÃO|QUESTAO|Questão|Questao)?\s*\d+[\.\-\)]?\s*/.test(line)) {
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
                    justification: null
                };
                continue;
            }
        }

        if (/^[a-eA-E][\)\.]\s/.test(line)) {
            if (currentQuestion) {
                const optText = line.replace(/^[a-eA-E][\)\.]\s*/, '');
                currentQuestion.options.push(optText);
            }
        }

        const answerMatch = line.match(/(?:Resposta|Gabarito)(?:\s+correta)?\s*:\s*([a-eA-E])/i);
        if (answerMatch && currentQuestion) {
            const map = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 };
            const letter = answerMatch[1].toLowerCase();
            if (map[letter] !== undefined) {
                currentQuestion.correctAnswer = map[letter];

                if (/^[a-eA-E][\)\.]\s/.test(line)) {
                    if (currentQuestion.options.length > 0) {
                        const lastOptIdx = currentQuestion.options.length - 1;
                        currentQuestion.options[lastOptIdx] = currentQuestion.options[lastOptIdx].replace(/(?:Resposta|Gabarito)(?:\s+correta)?\s*:\s*[a-eA-E].*/i, '').trim();
                    }
                }
            }
        }

        const justMatch = line.match(/(?:Comentário|Justificativa)\s*:\s*(.*)/i);
        if (justMatch && currentQuestion) {
            currentQuestion.justification = justMatch[1].trim();

            if (/^[a-eA-E][\)\.]\s/.test(line) && currentQuestion.options.length > 0) {
                const lastOptIdx = currentQuestion.options.length - 1;
                currentQuestion.options[lastOptIdx] = currentQuestion.options[lastOptIdx].replace(/(?:Comentário|Justificativa)\s*:\s*.*/i, '').trim();
            }
            continue;
        }

        if (/^(?:Resposta|Gabarito)(?:\s+correta)?\s*:/i.test(line)) {
            continue;
        }

        if (currentQuestion) {
            // Basic continuation logic (simplified from app)
            // in app it handles split lines better, here just basic check
        }
    }
    if (currentQuestion) questions.push(currentQuestion);
    return questions;
};

const testText = `1. Pergunta teste?
a) Opção A
b) Opção B
c) Opção C Gabarito: C Comentário: A resposta é C porque sim.`;

const result = parseQuizText(testText);
console.log(JSON.stringify(result, null, 2));
