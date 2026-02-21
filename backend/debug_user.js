const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function debugUser() {
    const emailToFind = "barbarahansen1233@gmail.com";
    console.log(`Searching for: '${emailToFind}'`);

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', emailToFind).get();

    if (snapshot.empty) {
        console.log('❌ Query returned NO results.');

        // Try listing all to see if there's a near match
        console.log('Listing all emails to check for whitespace/case issues:');
        const allUsers = await usersRef.get();
        allUsers.forEach(doc => {
            console.log(`- '${doc.data().email}' (Length: ${doc.data().email.length})`);
        });
    } else {
        console.log('✅ User FOUND.');
        snapshot.forEach(doc => {
            console.log('User Data:', doc.data());
            console.log('Password hash exists:', !!doc.data().password);
        });
    }
}

debugUser();
