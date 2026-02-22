const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Firebase Init
// Make sure you have 'serviceAccountKey.json' in this folder
const { db } = require('./firebaseConfig');
const { startScheduler } = require('./notificationService');
const twilio = require('twilio'); // Import Twilio

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Root Route
app.get('/', (req, res) => {
    res.send("Backend server is running!");
});

// Multer Setup
const multer = require('multer');
const path = require('path');
const { bucket } = require('./firebaseConfig');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    console.log("[UPLOAD] Request received to Firebase Storage");
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + path.extname(req.file.originalname);
        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            console.error("[UPLOAD ERROR]", err);
            res.status(500).json({ error: "Upload to Firebase failed" });
        });

        blobStream.on('finish', async () => {
            // Make public (Optional, or use signed URLs. Making public is easier for PDF display)
            try {
                await blob.makePublic();
            } catch (e) {
                console.log("Could not make public (might already be or permissions issue), using metadata instead");
            }

            const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            res.json({ url: fileUrl, filename: fileName });
        });

        blobStream.end(req.file.buffer);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Upload failed" });
    }
});

// Start Notifications
startScheduler();

const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

console.log("Starting Firebase Backend...");

// ------------------------------------------------------------------
// ANALYTICS ROUTES
// ------------------------------------------------------------------

// Record Visit
app.post('/visits', async (req, res) => {
    try {
        const { userAgent } = req.body;
        await db.collection('visits').add({
            timestamp: new Date().toISOString(),
            userAgent: userAgent || 'unknown'
        });
        res.status(201).send();
    } catch (e) {
        // Silently fail for analytics to not block user
        console.error("Analytics Error:", e.message);
        res.status(200).send();
    }
});

// Admin Stats
app.get('/admin/stats', async (req, res) => {
    try {
        const now = new Date();

        // Calculate Time Ranges
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Fetch all visits (For MVP. In prod, use distributed counters or aggregation queries)
        const snapshot = await db.collection('visits').get();
        const visits = snapshot.docs.map(doc => new Date(doc.data().timestamp));

        const stats = {
            today: 0,
            week: 0,
            month: 0,
            year: 0
        };

        visits.forEach(date => {
            if (date >= startOfDay) stats.today++;
            if (date >= startOfWeek) stats.week++;
            if (date >= startOfMonth) stats.month++;
            if (date >= startOfYear) stats.year++;
        });

        res.json(stats);

    } catch (e) {
        console.error("Stats Error:", e);
        res.status(500).json({ error: "Failed" });
    }
});

// ------------------------------------------------------------------
// AUTH ROUTES (Using Firestore)
// ------------------------------------------------------------------

// Register
app.post('/auth/register', async (req, res) => {
    const { name, email, password, role, age, sex, education, termsAccepted, privacyAccepted, whatsapp, studyShift, wantsReminders } = req.body;

    try {
        const userSnapshot = await db.collection('users').where('email', '==', email).get();

        if (!userSnapshot.empty) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE USER (AUTO-VERIFIED / NO CONFIRMATION)
        const newUserRef = await db.collection('users').add({
            name,
            email,
            password: hashedPassword,
            role: role || 'STUDENT',
            theme: 'LIGHT',
            age: age ? parseInt(age) : null,
            sex,
            education,
            termsAccepted: termsAccepted || false,
            privacyAccepted: privacyAccepted || false,
            isVerified: true, // AUTO-APPROVED
            whatsapp: whatsapp || null,
            studyShift: studyShift || null,
            wantsReminders: wantsReminders || false,
            createdAt: new Date().toISOString()
        });

        // AUTO-LOGIN RESPONSE
        const token = jwt.sign({ userId: newUserRef.id, role: role || 'STUDENT' }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            token,
            user: { id: newUserRef.id, name, email, role: role || 'STUDENT' },
            message: "Cadastro realizado com sucesso! Bem-vindo."
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
});

// Verify Email
app.post('/auth/verify-email', async (req, res) => {
    // ... verified route kept for compatibility ...
    res.json({ message: "Email verified successfully!" });
});

// Verify SMS Code
app.post('/auth/verify-sms', async (req, res) => {
    const { userId, code } = req.body;

    try {
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const data = doc.data();

        if (data.isVerified) {
            return res.status(400).json({ error: "User already verified" });
        }

        if (data.smsCode !== code) {
            return res.status(400).json({ error: "Invalid code" });
        }

        // Mark as verified
        await userRef.update({
            isVerified: true,
            smsCode: admin.firestore.FieldValue.delete(),
            smsCodeExpiresAt: admin.firestore.FieldValue.delete()
        });

        // Generate Token
        const token = jwt.sign({ userId: userId, role: data.role || 'STUDENT' }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: { id: userId, name: data.name, email: data.email, role: data.role || 'STUDENT' },
            message: "Verificação concluída!"
        });

    } catch (error) {
        console.error("SMS Verify Error:", error);
        res.status(500).json({ error: "Verification failed" });
    }
});

// Resend SMS Code
app.post('/auth/resend-sms', async (req, res) => {
    const { userId } = req.body;

    try {
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();

        if (!doc.exists) return res.status(404).json({ error: "User not found" });

        const smsCode = Math.floor(100000 + Math.random() * 900000).toString();

        await userRef.update({ smsCode });

        // TWILIO INTEGRATION
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
            try {
                const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
                await client.messages.create({
                    body: `Seu código de verificação AISIM: ${smsCode}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: doc.data().whatsapp || doc.data().email
                });
                console.log(`[TWILIO RESEND] SMS sent to ${doc.data().whatsapp}`);
            } catch (twilioError) {
                console.error("[TWILIO ERROR]", twilioError.message);
                console.log("FALLBACK: Code is " + smsCode);
            }
        } else {
            console.log(`\n[MOCK SMS SERVICE - RESEND] To: ${doc.data().whatsapp || doc.data().email} | Code: ${smsCode}\n`);
        }

        res.json({ message: "Código reenviado." });

    } catch (error) {
        console.error("Resend Error:", error);
        res.status(500).json({ error: "Failed to resend" });
    }
});

// Login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(400).json({ error: "User not found" });
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Check if user is verified -> DISABLED FOR TESTING
        // if (user.isVerified === false) {
        //     return res.status(403).json({ error: "Email não verificado. Verifique sua caixa de entrada." });
        // }

        const token = jwt.sign(
            { userId: userDoc.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: userDoc.id,
                email: user.email,
                name: user.name,
                role: user.role,
                theme: user.theme,
                onboardingSkipped: (user.studyShift && user.whatsapp) ? true : false
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

// Update Preferences
app.put('/users/:userId/preferences', async (req, res) => {
    const { userId } = req.params;
    const { whatsapp, studyShift, wantsReminders } = req.body;
    try {
        await db.collection('users').doc(userId).update({ whatsapp, studyShift, wantsReminders });
        res.json({ message: "Preferences updated" });
    } catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});

// Update Theme
app.put('/users/:userId/theme', async (req, res) => {
    const { userId } = req.params;
    const { theme } = req.body;
    try {
        await db.collection('users').doc(userId).update({ theme });
        res.json({ theme });
    } catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});

// Change Password
app.put('/auth/change-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (snapshot.empty) return res.status(404).json({ error: "User not found" });

        const userDoc = snapshot.docs[0];
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.collection('users').doc(userDoc.id).update({ password: hashedPassword });
        res.json({ message: "Password updated" });
    } catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});

// Admin: List Users
app.get('/admin/users', async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});

// Admin: Block User
app.put('/admin/users/:id/block', async (req, res) => {
    const { id } = req.params;
    const { isBlocked } = req.body;
    try {
        await db.collection('users').doc(id).update({ isBlocked });
        res.json({ message: "Updated" });
    } catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});

// Save Admin Content (Upsert)
app.post('/admin/weeks', async (req, res) => {
    try {
        const { weekId, dayId, lessonId, data } = req.body;

        // Create a unique ID for the document
        const docId = `content_${weekId}_${dayId}_${lessonId}`;

        await db.collection('content').doc(docId).set({
            weekId, dayId, lessonId, ...data, updatedAt: new Date().toISOString()
        }, { merge: true });

        res.status(201).json({ message: "Content saved successfully" });
    } catch (e) {
        console.error("Save Content Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// Get Content
app.get('/content', async (req, res) => {
    try {
        const { weekId, dayId, lessonId } = req.query;

        // Construct the ID same as saved
        // Note: For Concursim, we use the same structure: 
        // weekId (as moduleId), dayId (as subjectId), lessonId (1, usually)
        if (!weekId || !dayId) {
            console.log("Missing params:", req.query);
            return res.status(400).json({ error: "Missing required params" });
        }

        // Try to fetch specific doc first
        // If lessonId is not provided, we might default to 1 or handle it in frontend
        const targetLessonId = lessonId || "1";
        const docId = `content_${weekId}_${dayId}_${targetLessonId}`;

        const doc = await db.collection('content').doc(docId).get();

        if (!doc.exists) {
            // Return empty/default structure if not found so frontend doesn't crash
            return res.json({
                found: false,
                data: null
            });
        }

        res.json({
            found: true,
            data: doc.data()
        });

    } catch (e) {
        console.error("Get Content Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// Generate Simulado (Weekly Exam)
app.get('/content/simulado', async (req, res) => {
    try {
        const { weekId } = req.query;

        if (!weekId) {
            return res.status(400).json({ error: "Missing weekId" });
        }

        // Logic: Extract 4 questions from each of the 10 lessons (Day 1-5, Lesson 1-2)
        // Total: 40 questions
        const questions = [];

        // Loop through Days 1 to 5
        for (let day = 1; day <= 5; day++) {
            // Loop through Lessons 1 to 2
            for (let lesson = 1; lesson <= 2; lesson++) {
                const docId = `content_${weekId}_${day}_${lesson}`;
                const doc = await db.collection('content').doc(docId).get();

                if (doc.exists) {
                    const data = doc.data();
                    if (data.questions && Array.isArray(data.questions)) {
                        // Extract 4 random questions
                        const shuffled = data.questions.sort(() => 0.5 - Math.random());
                        const selected = shuffled.slice(0, 4);
                        questions.push(...selected);
                    }
                }
            }
        }

        // Shuffle the final 40 questions
        const finalQuestions = questions.sort(() => 0.5 - Math.random());

        res.json({
            found: true,
            data: {
                questions: finalQuestions
            }
        });

    } catch (e) {
        console.error("Generate Simulado Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// Generate Concursim Exam (Module Exam)
app.get('/content/concursim-exam', async (req, res) => {
    try {
        const { moduleId } = req.query;

        if (!moduleId) {
            return res.status(400).json({ error: "Missing moduleId" });
        }

        // Concursim Logic: 9 Subjects per Module.
        // weekId = moduleId + 100
        // dayId = subjectId (1-9)
        // lessonId = 1 (Assuming 1 lesson per subject per module for now)
        // Total: 45 questions (5 per subject)

        const questions = [];
        const internalWeekId = parseInt(moduleId) + 100;

        for (let subjectId = 1; subjectId <= 9; subjectId++) {
            const docId = `content_${internalWeekId}_${subjectId}_1`; // Assuming lessonId 1
            const doc = await db.collection('content').doc(docId).get();

            if (doc.exists) {
                const data = doc.data();
                // Check for questions array (support both 'questions' and 'questionsSuperior' if needed, defaulting to standard or combining?)
                // For simplicity, let's use 'questions' (Medium level) or mix?
                // The prompt implies "content same as web". Web usually has standard questions.
                // Let's grab from 'questions'.
                const sourceQuestions = data.questions || [];

                if (Array.isArray(sourceQuestions) && sourceQuestions.length > 0) {
                    // Extract 5 random questions
                    const shuffled = sourceQuestions.sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 5);

                    // Add subject metadata if useful for frontend
                    const labeled = selected.map(q => ({
                        ...q,
                        subjectId, // To identify subject in frontend if needed
                        originModule: moduleId
                    }));

                    questions.push(...labeled);
                }
            }
        }

        // Shuffle final 45
        const finalQuestions = questions.sort(() => 0.5 - Math.random());

        res.json({
            found: true,
            data: {
                questions: finalQuestions
            }
        });

    } catch (e) {
        console.error("Generate Concursim Exam Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// ------------------------------------------------------------------
// PROGRESS ROUTES (Simulado / Enemsim)
// ------------------------------------------------------------------

// Get User Progress
app.get('/users/:userId/progress', async (req, res) => {
    try {
        const { userId } = req.params;
        const doc = await db.collection('user_progress').doc(userId).get();
        if (!doc.exists) {
            return res.json({ completedWeeks: [], completedLessons: [] });
        }
        res.json(doc.data());
    } catch (e) {
        console.error("Get Progress Error:", e);
        res.status(500).json({ error: "Failed to fetch progress" });
    }
});

// Update User Progress
app.post('/users/:userId/progress', async (req, res) => {
    try {
        const { userId } = req.params;
        const { completedWeeks, completedLessons, completedModules } = req.body;

        // Use Set with Merge to update
        await db.collection('user_progress').doc(userId).set({
            completedWeeks: completedWeeks || [],
            completedLessons: completedLessons || [],
            completedModules: completedModules || [],
            updatedAt: new Date().toISOString()
        }, { merge: true });

        res.json({ message: "Progress saved" });
    } catch (e) {
        console.error("Save Progress Error:", e);
        res.status(500).json({ error: "Failed to save progress" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database Mode: FIREBASE (Firestore)`);
});
