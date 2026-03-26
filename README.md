# 📋 Follow-up System

Sistema de gestão de follow-up de projetos com dashboard compartilhado, histórico de alterações, comentários e perguntas respondidas por IA.

## Stack

| Camada | Tecnologia | Hospedagem gratuita |
|--------|-----------|---------------------|
| Banco  | PostgreSQL (Supabase) | supabase.com |
| Backend | Node.js + Express + TypeScript | render.com |
| Frontend | React + Vite + TypeScript | vercel.com |

---

## ⚙️ Configuração do Supabase (banco de dados)

1. Acesse [supabase.com](https://supabase.com) e crie conta via GitHub
2. Clique em **New Project** → dê um nome → região **South America (São Paulo)** → crie
3. Vá em **SQL Editor** → cole o conteúdo de `supabase-schema.sql` → clique **Run**
4. Vá em **Project Settings → API** e copie:
   - `Project URL` → vai para `SUPABASE_URL`
   - Chave `service_role` (em API Keys) → vai para `SUPABASE_SERVICE_KEY`

---

## 🔑 Variáveis de ambiente

### Backend (`backend/.env`)
```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:3001
```

---

## 🚀 Rodando localmente

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env        # preencha com suas credenciais
npm install
npm run dev                  # http://localhost:3001

# Terminal 2 — Frontend
cd frontend
cp .env.example .env         # ajuste VITE_API_URL se necessário
npm install
npm run dev                  # http://localhost:5173
```

---

## ☁️ Deploy gratuito na nuvem

### Backend → Render.com
1. Crie conta em [render.com](https://render.com)
2. **New → Web Service** → conecte seu repositório GitHub
3. Configure:
   - **Root directory**: `backend`
   - **Build command**: `npm install && npm run build`
   - **Start command**: `node dist/index.js`
4. Em **Environment**, adicione as variáveis do `backend/.env`
5. Copie a URL gerada (ex: `https://followup-backend.onrender.com`)

### Frontend → Vercel.com
1. Crie conta em [vercel.com](https://vercel.com)
2. **New Project** → importe o repositório → configure:
   - **Root directory**: `frontend`
   - **Framework**: Vite
3. Em **Environment Variables**, adicione:
   - `VITE_API_URL` = URL do seu backend no Render
4. Copie a URL do Vercel e atualize `FRONTEND_URL` no Render

---

## 🎯 Funcionalidades

- ✅ Dashboard com cards por projeto, filtro por status e busca
- ✅ Indicador ❓ nos cards que têm perguntas respondidas pela IA
- ✅ Criar, editar e excluir projetos
- ✅ Página de detalhes com 4 abas: Detalhes · Perguntas IA · Comentários · Histórico
- ✅ IA responde perguntas contextuais sobre cada projeto (Claude Sonnet)
- ✅ Comentários por projeto
- ✅ Histórico automático de todas as alterações (quem mudou o quê e quando)
- ✅ Identificação de usuário salva no localStorage

---

## 📁 Estrutura

```
followup-system/
├── supabase-schema.sql       # Execute no Supabase SQL Editor
├── backend/
│   ├── src/
│   │   ├── index.ts          # Servidor Express
│   │   ├── lib/supabase.ts   # Cliente Supabase
│   │   ├── routes/
│   │   │   ├── projects.ts   # CRUD projetos + histórico
│   │   │   └── comments.ts   # CRUD comentários
│   │   └── types/index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.tsx     # Lista de projetos
    │   │   └── ProjectDetail.tsx # Detalhes + abas
    │   ├── components/
    │   │   ├── ProjectCard.tsx   # Card do dashboard
    │   │   ├── ProjectForm.tsx   # Modal criar/editar
    │   │   ├── AskAI.tsx         # Perguntas à IA
    │   │   ├── CommentsSection.tsx
    │   │   ├── HistorySection.tsx
    │   │   ├── StatusBadge.tsx
    │   │   └── UserModal.tsx
    │   ├── hooks/useProjects.ts  # API calls
    │   ├── lib/
    │   │   ├── api.ts            # Axios client
    │   │   └── UserContext.tsx   # Nome/email do usuário
    │   └── types/index.ts
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```