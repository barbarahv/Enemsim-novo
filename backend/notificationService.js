const { db } = require('./firebaseConfig');
const cron = require('node-cron');

// Mock WhatsApp Sending Function
// In proper implementation, integrate with Twilio, WppConnect, or similar
async function sendWhatsAppMessage(phone, message) {
    console.log(`[WHATSAPP SIMULATION] Sending to ${phone}: "${message}"`);
    return true;
}

async function runNotificationCycle(shiftName) {
    console.log(`\n🔔 Running Notification Cycle for: ${shiftName}`);
    try {
        // Simple string search implementation. 
        // Ideally, studyShift should be an array in Firestore for better querying 'array-contains', 
        // but current implementation saves as "MANHA,TARDE" string.

        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('wantsReminders', '==', true).get();

        if (snapshot.empty) {
            console.log("No users found for reminders.");
            return;
        }

        let count = 0;
        snapshot.forEach(doc => {
            const user = doc.data();

            // Check if user has this shift in their comma-separated string
            if (user.studyShift && user.studyShift.includes(shiftName) && user.whatsapp) {
                const msg = `Olá ${user.name}! 📚 Hora de focar nos estudos do turno da ${shiftName}! #FocoNoEnem`;
                sendWhatsAppMessage(user.whatsapp, msg);
                count++;
            }
        });

        console.log(`✅ Cycle Complete. Sent ${count} reminders.`);

    } catch (error) {
        console.error("Error in notification cycle:", error);
    }
}

// Schedule CRON Jobs
// 0 8 * * * -> 8:00 AM
// 0 14 * * * -> 2:00 PM
// 0 19 * * * -> 7:00 PM

function startScheduler() {
    console.log("⏰ Notification Scheduler Started...");

    // Morning (8:00)
    cron.schedule('0 8 * * *', () => {
        runNotificationCycle('MANHA');
    });

    // Afternoon (14:00)
    cron.schedule('0 14 * * *', () => {
        runNotificationCycle('TARDE');
    });

    // Night (19:00)
    cron.schedule('0 19 * * *', () => {
        runNotificationCycle('NOITE');
    });
}

// Block execution when running this file directly (node notificationService.js)
if (require.main === module) {
    // If running manually, we can test all cycles instantly
    console.log("🔧 Manual Trigger Mode");
    (async () => {
        await runNotificationCycle('MANHA');
        await runNotificationCycle('TARDE');
        await runNotificationCycle('NOITE');
        console.log("Manual trigger finished. Exiting.");
        process.exit(0);
    })();
} else {
    module.exports = { startScheduler };
}
