
async function testBackend() {
    try {
        console.log("Testing connection to http://localhost:3002...");
        const res = await fetch('http://localhost:3002/content?weekId=1&dayId=1&lessonId=1');
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response:", text.substring(0, 100)); // Show first 100 chars
    } catch (e) {
        console.error("Connection failed:", e.message);
        if (e.cause) console.error("Cause:", e.cause);
    }
}

testBackend();
