
async function checkVideoUrl() {
    try {
        // Fetch Enemsim Lesson 1 (Week 1, Day 1)
        const res = await fetch('http://127.0.0.1:3002/content?weekId=1&dayId=1&lessonId=1');
        const json = await res.json();
        console.log("Video URL:", json.data?.videoUrl);
    } catch (e) {
        console.error(e);
    }
}

checkVideoUrl();
