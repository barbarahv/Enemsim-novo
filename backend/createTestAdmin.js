const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestAdmin() {
    const email = 'admin_teste@enemsim.com';
    const password = 'senha_teste_123';
    const name = 'Admin Secundário (Teste)';

    console.log(`🔒 Criando Admin de Teste: ${email}...`);

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
                role: 'ADMIN',
                theme: 'LIGHT',
                canApprove: false // Explicitly FALSE (Secondary Admin)
            },
        });

        console.log("✅ SUCESSO! Admin de TESTE criado.");
        console.log("   Login: " + email);
        console.log("   Senha: " + password);
        console.log("-----------------------------------------");

    } catch (e) {
        console.error("Erro ao criar admin de teste:", e);
    } finally {
        await prisma.$disconnect();
    }
}

createTestAdmin();
