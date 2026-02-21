const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    const email = 'admin@enemsim.com'; // VOCÊ PODE MUDAR AQUI
    const password = 'senha_super_secreta'; // VOCÊ PODE MUDAR AQUI
    const name = 'Administrador Geral';

    console.log(`🔒 Criando Administrador: ${email}...`);

    try {
        // Check if exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log("⚠️  Este usuário já existe!");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'ADMIN', // The only place where ADMIN is allowed
                theme: 'DARK'
            },
        });

        console.log("✅ SUCESSO! Administrador criado.");
        console.log("   Login: " + email);
        console.log("   Senha: " + password);
        console.log("-----------------------------------------");
        console.log("📢 Use estes dados no /login para acessar o Painel.");

    } catch (e) {
        console.error("Erro ao criar admin:", e);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
