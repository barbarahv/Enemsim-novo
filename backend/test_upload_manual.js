const fs = require('fs');
const path = require('path');

async function testUpload() {
    const formData = new FormData();
    const blob = new Blob(['test content'], { type: 'text/plain' });
    formData.append('file', blob, 'test.txt');

    try {
        console.log("Attempting upload to localhost:3002...");
        const res = await fetch('http://localhost:3002/upload', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            console.log("Upload SUCCESS:", data);
        } else {
            console.error("Upload FAILED:", res.status, res.statusText);
            const text = await res.text();
            console.error("Response:", text);
        }
    } catch (e) {
        console.error("Fetch ERROR:", e);
    }
}

testUpload();
