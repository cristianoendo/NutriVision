# 🌿 VidaLeve - Nutrição Inteligente

> Seu equilíbrio hormonal começa no prato

VidaLeve é um aplicativo SaaS mobile-responsive completo de nutrição e emagrecimento, com foco em medicina funcional, otimização hormonal e personalização baseada no tipo corporal.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Visão Geral

VidaLeve é mais do que um contador de calorias - é um assistente nutricional inteligente que considera:

- **Tipo Corporal**: Identifica se você é tipo Maçã (resistência insulínica), Pêra (dominância estrogênica) ou Misto
- **Metabolismo Único**: Calcula seu TMB, TDEE e metas personalizadas
- **Medicina Funcional**: Recomendações baseadas em nutrologia e endocrinologia
- **Análise com IA**: Análise nutricional inteligente dos alimentos

## ✨ Funcionalidades Principais (MVP)

### ✅ Implementado

- **Splash Screen Animado**: Introdução elegante ao app com animações suaves
- **Onboarding Completo**: 4 telas educativas + formulário multi-step
- **Perfil Personalizado**: Coleta de dados com validação em tempo real
- **Cálculos Automáticos**:
  - IMC (Índice de Massa Corporal) com diagnóstico
  - TMB (Taxa Metabólica Basal) usando Mifflin-St Jeor
  - TDEE (Gasto Energético Total) ajustado por atividade
  - RCQ (Relação Cintura/Quadril) com determinação de tipo corporal
  - Percentual de gordura corporal estimado
  - Metas nutricionais personalizadas (calorias, macros, fibras, água)
- **Dashboard Interativo**:
  - Progresso de calorias com barra animada
  - Círculos de macronutrientes (Proteínas, Carboidratos, Gorduras)
  - Lista de refeições do dia com detalhes
  - Dicas personalizadas baseadas no tipo corporal
- **Sistema de Refeições**:
  - Entrada manual de alimentos
  - Análise nutricional com IA (mock)
  - Múltiplos tipos de refeição
  - Tracking completo de macros
- **Tela de Perfil**:
  - Visualização de todas as métricas corporais
  - Edição de peso e medidas
  - Recomendações personalizadas
- **Gerenciamento de Estado**: Zustand com persistência local
- **Dark Mode**: Suporte completo a tema escuro
- **PWA Ready**: Configurado como Progressive Web App

### 🚧 Próximas Fases

- **Fase 2**: Scanner de código de barras, fotos de alimentos, receitas, gráficos
- **Fase 3**: Entrada de voz, wearables, chatbot IA, notificações push

## 🛠️ Stack Tecnológica

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **State Management**: Zustand com persistência
- **UI Components**: Custom components (shadcn/ui style)
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

Acesse: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Card, Input)
│   ├── layout/          # Layout (BottomNav)
│   └── features/        # Features (splash, onboarding, dashboard)
├── pages/               # Páginas principais
├── services/            # Lógica de negócio e APIs
├── store/               # Zustand state management
├── types/               # TypeScript types
├── lib/                 # Utilities
└── styles/              # Global styles
```

## 🧮 Cálculos e Fórmulas

### IMC
```
IMC = peso (kg) / altura² (m)
```

### TMB (Mifflin-St Jeor)
```
Mulheres: (10 × peso) + (6.25 × altura) - (5 × idade) - 161
Homens: (10 × peso) + (6.25 × altura) - (5 × idade) + 5
```

### Metas Nutricionais por Tipo Corporal

- **Tipo Maçã**: 35% proteína, 30% carbs, 35% gorduras
- **Tipo Pêra**: 30% proteína, 40% carbs, 30% gorduras
- **Tipo Misto**: 30% proteína, 40% carbs, 30% gorduras

## 🔌 Integração com IA

Configure em `.env`:

```bash
VITE_OPENAI_API_KEY=your_key
VITE_OPENAI_MODEL=gpt-4
# ou
VITE_CLAUDE_API_KEY=your_key
```

Modifique `src/services/aiService.ts` para conectar à API real.

## 📱 PWA

O app pode ser instalado em dispositivos móveis. Configure o manifest e service worker conforme necessário.

## 🚦 Roadmap

- [ ] Integração com APIs de alimentos reais
- [ ] Scanner de código de barras
- [ ] Análise de fotos com IA Vision
- [ ] Backend e autenticação
- [ ] Notificações push
- [ ] Integração com wearables
- [ ] Chatbot IA contextual
- [ ] Plano premium

## 📄 Licença

MIT License

---

**VidaLeve** - Seu equilíbrio hormonal começa no prato 🌿✨
