const nodemailer = require('nodemailer');
require('dotenv').config();

async function main() {
    console.log("Testing Email Configuration...");
    console.log(`User: ${process.env.EMAIL_USER}`);
    console.log(`Pass length: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0}`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.verify();
        console.log("✅ Server is ready to take our messages");

        const info = await transporter.sendMail({
            from: `"ENEMSIM Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Teste de Configuração ✔",
            text: "Se você recebeu isso, a configuração está correta!",
            html: "<b>Se você recebeu isso, a configuração está correta!</b>",
        });

        console.log("✅ Message sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

main();
