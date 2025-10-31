# 📂 Estrutura do Projeto VidaLeve

## 🗺️ Mapa Completo de Arquivos

```
NutriVision/
│
├── 📄 Documentação (RAIZ)
│   ├── README.md                    ← Visão geral do projeto
│   ├── GUIA_DE_TESTE.md            ← Como testar o app (NOVO!)
│   ├── SUPABASE_SETUP.md           ← Setup do backend
│   ├── ANALISE_COMPLETA.md         ← Análise + roadmap mercado
│   └── INICIAR_TESTE.sh            ← Script para iniciar (NOVO!)
│
├── 🔧 Configuração
│   ├── package.json                 ← Dependências do projeto
│   ├── .env.example                 ← Exemplo de variáveis de ambiente
│   ├── tsconfig.json                ← Configuração TypeScript
│   ├── vite.config.ts               ← Configuração Vite
│   ├── tailwind.config.js           ← Configuração Tailwind CSS
│   └── postcss.config.js            ← Configuração PostCSS
│
├── 🗄️ Backend (Supabase)
│   └── supabase/
│       └── schema.sql               ← Schema completo do banco de dados
│
└── 💻 Código Fonte
    └── src/
        ├── 🎨 Componentes UI Base
        │   └── components/ui/
        │       ├── button.tsx
        │       ├── card.tsx
        │       ├── input.tsx
        │       ├── progress.tsx
        │       ├── label.tsx
        │       └── badge.tsx
        │
        ├── 🏗️ Componentes de Features
        │   └── components/features/
        │       ├── splash/
        │       │   └── SplashScreen.tsx
        │       ├── auth/                    ← NOVO! Sprint 1B
        │       │   └── AuthFlow.tsx
        │       ├── onboarding/
        │       │   ├── OnboardingFlow.tsx
        │       │   ├── UserProfileForm.tsx
        │       │   └── screens/
        │       ├── dashboard/
        │       │   ├── CalorieProgress.tsx
        │       │   ├── MacroCircle.tsx
        │       │   ├── MealsList.tsx
        │       │   └── WaterTracker.tsx     ← Fase 3
        │       ├── meals/
        │       │   ├── PhotoUpload.tsx
        │       │   ├── BarcodeScanner.tsx
        │       │   └── VoiceInput.tsx       ← Fase 3
        │       ├── recipes/
        │       │   ├── RecipeCard.tsx
        │       │   └── RecipeDetail.tsx
        │       └── progress/
        │           └── ProgressCharts.tsx   ← Fase 3
        │
        ├── 📱 Páginas
        │   └── pages/
        │       ├── Login.tsx                ← Sprint 1A
        │       ├── Register.tsx             ← Sprint 1A
        │       ├── ForgotPassword.tsx       ← NOVO! Sprint 1B
        │       ├── Dashboard.tsx
        │       ├── AddMeal.tsx
        │       ├── Progress.tsx             ← Fase 3
        │       ├── Recipes.tsx
        │       └── Profile.tsx
        │
        ├── 🔌 Serviços (Backend)
        │   └── services/
        │       ├── authService.ts           ← Sprint 1A (Auth)
        │       ├── profileService.ts        ← Sprint 1A (CRUD perfis)
        │       ├── mealsService.ts          ← Sprint 1A (CRUD refeições)
        │       ├── bodyMetricsService.ts    ← Sprint 1A (Métricas)
        │       ├── waterService.ts          ← Sprint 1A (Água)
        │       ├── calculations.ts          ← Cálculos nutricionais
        │       ├── aiService.ts             ← IA (mock)
        │       └── openFoodFactsService.ts  ← Barcode (real)
        │
        ├── 🗃️ Estado Global
        │   └── store/
        │       └── useAppStore.ts           ← Zustand store (ATUALIZADO Sprint 1B)
        │
        ├── 📚 Bibliotecas
        │   └── lib/
        │       ├── supabase.ts              ← Cliente Supabase
        │       ├── supabase-types.ts        ← Tipos do banco
        │       └── utils.ts
        │
        ├── 🎯 Tipos TypeScript
        │   └── types/
        │       ├── index.ts                 ← Tipos principais
        │       ├── speech-recognition.d.ts  ← Tipos Web Speech API
        │       └── vite-env.d.ts           ← NOVO! Tipos Vite
        │
        ├── 📊 Dados
        │   └── data/
        │       └── recipes.ts               ← 6 receitas funcionais
        │
        ├── 🎨 Estilos
        │   └── styles/
        │       └── globals.css
        │
        ├── 🪝 Hooks Customizados
        │   └── hooks/
        │       └── useVoiceInput.ts         ← Fase 3
        │
        ├── 🎭 Layout
        │   └── components/layout/
        │       └── BottomNav.tsx
        │
        ├── 🚀 Arquivos Principais
        │   ├── App.tsx                      ← ATUALIZADO! Sprint 1B
        │   ├── main.tsx
        │   └── index.html
        │
        └── 📦 Build (gerado)
            └── dist/                        ← Criado ao rodar npm run build
```

---

## 📈 Evolução do Projeto

### **Commits Principais:**

```
99657bf (HEAD) ← Você está aqui!
│  └─ docs: Guia de teste + script helper
│
e48a651
│  └─ feat: Sprint 1B - Integração Supabase completa
│      • AuthFlow.tsx
│      • ForgotPassword.tsx
│      • App.tsx integrado
│      • Store migrado
│
2da67b0
│  └─ feat: Sprint 1A - Backend + Auth
│      • authService.ts
│      • profileService.ts
│      • mealsService.ts
│      • waterService.ts
│      • bodyMetricsService.ts
│      • supabase/schema.sql
│      • Login.tsx & Register.tsx
│
274b037
│  └─ docs: Análise completa + roadmap
│
2de71cc
│  └─ feat: Fase 3 - Progresso & Voice
│      • Progress.tsx
│      • ProgressCharts.tsx
│      • VoiceInput.tsx
│      • WaterTracker.tsx
│      • useVoiceInput.ts
│
... (commits anteriores)
```

---

## 🔢 Estatísticas do Projeto

### **Arquivos Criados:**
- **Frontend**: ~30 componentes React
- **Backend**: 5 serviços Supabase
- **Páginas**: 8 páginas principais
- **Documentação**: 4 arquivos MD
- **Configuração**: ~10 arquivos config

### **Linhas de Código:**
- **TypeScript/TSX**: ~5,000 linhas
- **CSS**: ~500 linhas
- **SQL**: ~400 linhas
- **Documentação**: ~2,000 linhas

### **Dependências:**
- **Produção**: 15 pacotes
- **Desenvolvimento**: 20 pacotes
- **Total**: 441 pacotes (incluindo sub-dependências)

---

## 📦 Tamanho dos Arquivos

### **Build de Produção:**
```
dist/
├── index.html           1.43 KB
├── index.css           13.38 KB (3.05 KB gzipped)
├── index.js         1,378.18 KB (408.17 KB gzipped)
├── sw.js               ~50 KB (service worker)
└── manifest.json      0.49 KB
```

**Total**: ~1.4 MB (minificado e otimizado)
**Gzipped**: ~410 KB (o que realmente baixa)

---

## 🌐 Onde Cada Parte Está

### **1. Código Fonte**
📍 `/home/user/NutriVision/src/`
- Todo o código React/TypeScript
- Componentes, páginas, serviços
- **Editável** por mim durante desenvolvimento

### **2. Documentação**
📍 `/home/user/NutriVision/*.md`
- README, guias, análises
- **Acessível** para você ler

### **3. Configuração**
📍 `/home/user/NutriVision/*.config.*`
- Vite, TypeScript, Tailwind
- **Raramente** precisa mudar

### **4. Backend (SQL)**
📍 `/home/user/NutriVision/supabase/schema.sql`
- Schema completo do banco
- **Executar** no Supabase quando configurar

### **5. Build**
📍 `/home/user/NutriVision/dist/`
- Versão compilada para produção
- **Gerado** automaticamente ao rodar `npm run build`
- **Este** é o que você faz deploy

---

## 🔄 Fluxo de Trabalho

```
┌─────────────────────────────────────────────────┐
│  1. Código está aqui (ambiente Claude Code)    │
│     /home/user/NutriVision/                     │
└────────────────┬────────────────────────────────┘
                 │
                 ├─► Git push
                 │
┌────────────────▼────────────────────────────────┐
│  2. Código no Git Repository                    │
│     Branch: claude/saas-nutrition-app-mvp-...   │
└────────────────┬────────────────────────────────┘
                 │
                 ├─► git clone (você)
                 │
┌────────────────▼────────────────────────────────┐
│  3. Código no SEU computador                    │
│     C:\Users\Você\NutriVision\                  │
│     (ou /Users/Você/NutriVision/)              │
└────────────────┬────────────────────────────────┘
                 │
                 ├─► npm run build
                 │
┌────────────────▼────────────────────────────────┐
│  4. Deploy (futuro)                             │
│     Vercel/Netlify/seu servidor                 │
│     https://vidaleve.com                        │
└─────────────────────────────────────────────────┘
```

---

## 💡 Próximo Passo Recomendado

Para ter os arquivos **no seu computador**:

```bash
# No seu terminal (Git Bash, PowerShell, Terminal, etc)
git clone <URL_DO_SEU_REPOSITORIO>
cd NutriVision
git checkout claude/saas-nutrition-app-mvp-011CUcdsCUVbnxTPHhJpXozi
npm install
npm run dev
```

Agora você tem **tudo localmente** e pode:
- ✅ Abrir no VS Code
- ✅ Editar como quiser
- ✅ Rodar e testar
- ✅ Fazer deploy

---

**Precisa de ajuda para fazer o clone?** Me avise e te ajudo! 😊
