const { db } = require('../firebaseConfig');

async function makeAdmin(email) {
    try {
        console.log(`Searching for user with email: ${email}`);
        const snapshot = await db.collection('users').where('email', '==', email).get();

        if (snapshot.empty) {
            console.log('User not found.');
            return;
        }

        const userDoc = snapshot.docs[0];
        await db.collection('users').doc(userDoc.id).update({ role: 'ADMIN' });
        console.log(`Successfully updated user ${email} to ADMIN role.`);
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

makeAdmin('barbarahansen1233@gmail.com');
