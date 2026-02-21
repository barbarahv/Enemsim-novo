const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Subject to Day ID Mapping
const SUBJECT_MAP = {
    "Humanas": 1,
    "Linguagens": 2, // Includes Ingles/Espanhol often
    "Natureza": 3,
    "Matemática": 4,
    "Redação": 5,
    "Simulado": 6,
    "Atualidades": 5 // Map to Friday for now, or skip if strict
};

async function importContent() {
    try {
        const rawData = fs.readFileSync('E:\\content_export.json', 'utf8');
        const jsonData = JSON.parse(rawData);
        const lessons = jsonData.lessons;

        console.log(`Found ${lessons.length} lessons to import.`);

        // Group by Week + Subject
        const grouped = {};

        lessons.forEach(lesson => {
            const week = lesson.week;
            const subject = lesson.subject;
            const dayId = SUBJECT_MAP[subject];

            if (!dayId) {
                console.log(`Skipping unknown subject: ${subject}`);
                return;
            }

            const key = `${week}_${dayId}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(lesson);
        });

        // Loop through groups and save
        for (const key in grouped) {
            const groupLessons = grouped[key];
            const [weekId, dayId] = key.split('_');

            // Merge strategy: 
            // - Title: Use first one or combined? Let's use first.
            // - Video: Use first url found.
            // - PDF: Use first pdf found.
            // - Questions: Concatenate all.
            // - We save to lessonId = 1 (Default for day)

            const mergedQuestions = [];
            let videoUrl = "";
            let pdfName = "";

            groupLessons.forEach(l => {
                if (l.questions) {
                    // Normalize question structure if needed
                    // JSON: { id, text, options: {A, B...}, correctOption, justification? }
                    // App expects: { id, text, options: string[], correctAnswer: index, justification }

                    l.questions.forEach(q => {
                        const optionsObj = q.options || {};
                        const optionsArr = [
                            optionsObj.A || "",
                            optionsObj.B || "",
                            optionsObj.C || "",
                            optionsObj.D || "",
                            optionsObj.E || ""
                        ].filter(o => o !== ""); // Keep only valid options

                        // Map "A" -> 0, "B" -> 1...
                        const correctMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
                        const correctIdx = correctMap[q.correctOption] !== undefined ? correctMap[q.correctOption] : 0;

                        mergedQuestions.push({
                            id: mergedQuestions.length + 1,
                            text: q.text,
                            options: optionsArr,
                            correctAnswer: correctIdx,
                            justification: q.justification || "Sem justificativa."
                        });
                    });
                }

                if (!videoUrl && l.videoUrls && l.videoUrls.length > 0) {
                    videoUrl = l.videoUrls[0];
                }
                if (!pdfName && l.pdfPaths && l.pdfPaths.length > 0) {
                    pdfName = l.pdfPaths[0].title || "Apostila";
                    pdfUrl = l.pdfPaths[0].url || "";
                }
            });

            const docId = `content_${weekId}_${dayId}_1`;
            const docData = {
                weekId: parseInt(weekId),
                dayId: parseInt(dayId),
                lessonId: 1,
                videoUrl: videoUrl || "",
                pdfName: pdfName || "",
                pdfUrl: pdfUrl || "",
                questions: mergedQuestions,
                updatedAt: new Date().toISOString(),
                imported: true
            };

            await db.collection('content').doc(docId).set(docData);
            console.log(`Saved ${docId} (${groupLessons.length} source lessons merged)`);
        }

        console.log("Import completed!");

    } catch (e) {
        console.error("Import failed:", e);
    }
}

importContent();
