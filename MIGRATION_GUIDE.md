# Guia de Migração de Ambiente - ENEMSIM

Este guia explica como configurar o projeto em um novo computador e como o sistema está configurado agora.

## 🔗 Links Oficiais
*   **GitHub (Código):** `https://github.com/barbarahv/Enemsim-novo`
*   **API (Backend):** `https://api-enemsim.onrender.com`

---

## 1. No Novo Computador

### Passo 1: Instalar o básico
Instale o [Node.js](https://nodejs.org/) (versão 18+) e o [Git](https://git-scm.com/).

### Passo 2: Baixar o código
Abra o Git Bash ou terminal e rode:
```bash
git clone https://github.com/barbarahv/Enemsim-novo.git
```

### Passo 3: Abrir no VS Code e Instalar
Abra a pasta no VS Code e rode os comandos para instalar tudo:
```bash
# Na pasta backend
cd backend
npm install

# Na pasta web
cd ../web
npm install
```

---

## 2. Banco de Dados (Firebase)
O Projeto já está conectado ao Firebase `enemsim-4e586`.

**IMPORTANTE:** Se você precisar mudar algo no banco ou se as credenciais expirarem:
1. Baixe o `serviceAccountKey.json` do Console do Firebase.
2. No seu computador local, salve-o na pasta `backend/`.
3. No **Render.com**, atualize o conteúdo do "Secret File" chamado `serviceAccountKey.json` com o texto novo.

---

## 3. Gerando o App Android (aab/apk)
Para lançar o app no Google Play Console:

1.  No computador novo, abra o arquivo `web/.env.local` e confirme se o link da API está correto.
2.  No terminal da pasta `web`, rode:
    ```bash
    npm run build
    npx cap sync
    ```
3.  Abra a pasta `web/android` no **Android Studio**.
4.  Vá em **Build > Generate Signed Bundle / APK**.
5.  Siga o assistente do Google para gerar o arquivo `.aab`.

---

## 4. Como atualizar o sistema
Sempre que você mudar o código e quiser que ele vá para a internet:
1. Faça o commit e push para o GitHub:
   ```bash
   git add .
   git commit -m "Minha atualização"
   git push origin main
   ```
2. O **Render** vai atualizar o servidor automaticamente em alguns minutos.
3. Se mudar algo no design do app, lembre-se de rodar o `npm run build` e `npx cap sync` antes de gerar o novo Android no Android Studio.
