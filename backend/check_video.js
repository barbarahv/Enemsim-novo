const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in fetch in newer Node

async function checkContent() {
    // Week 2, Day 3 (Natureza), Lesson 1
    // Admin ID construction: content_{week}_{day}_{lesson}
    // weekId=2, dayId=3, lessonId=1
    const weekId = 2;
    const dayId = 3;
    const lessonId = 1;

    try {
        console.log(`Fetching content for Week ${weekId}, Day ${dayId}, Lesson ${lessonId}...`);
        const res = await fetch(`http://localhost:3002/content?weekId=${weekId}&dayId=${dayId}&lessonId=${lessonId}`);
        const json = await res.json();

        console.log("Response status:", res.status);
        if (json.found) {
            console.log("Content Found:");
            console.log("Video URL:", JSON.stringify(json.data.videoUrl));
            console.log("Full Data:", JSON.stringify(json.data, null, 2));
        } else {
            console.log("Content Not Found");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkContent();
