# 🧪 Guia Rápido de Teste - VidaLeve

## 📍 Localização dos Arquivos

Todos os arquivos de documentação estão na **raiz do projeto**:

```
/home/user/NutriVision/
├── ANALISE_COMPLETA.md     ← Análise detalhada + roadmap para mercado
├── SUPABASE_SETUP.md       ← Guia de configuração do Supabase
├── README.md               ← Visão geral do projeto
└── ...
```

Para visualizar qualquer arquivo:
```bash
cat SUPABASE_SETUP.md
# ou
cat ANALISE_COMPLETA.md
```

---

## 🚀 Como Testar o App (2 Opções)

### **Opção 1: Teste Rápido SEM Supabase** ⚡ (Mais Rápido)

Melhor para testar funcionalidades sem configurar banco de dados.

```bash
# 1. Certifique-se de estar no diretório do projeto
cd /home/user/NutriVision

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

**O que acontece:**
- ✅ App inicia em `http://localhost:5173` (ou outra porta disponível)
- ✅ Vai direto para o Splash Screen
- ✅ Depois para o Onboarding (sem login)
- ✅ Dados salvos em localStorage do navegador
- ✅ Funciona 100% offline
- ❌ Não tem autenticação
- ❌ Não sincroniza entre dispositivos

**Funcionalidades disponíveis:**
- ✅ Onboarding completo
- ✅ Dashboard com tracking de calorias
- ✅ Adicionar refeições (texto, foto, barcode)
- ✅ Biblioteca de receitas
- ✅ Gráficos de progresso
- ✅ Entrada por voz
- ✅ Rastreamento de água
- ✅ Perfil com métricas corporais
- ✅ Dark mode

---

### **Opção 2: Teste Completo COM Supabase** 🔐 (Produção-Ready)

Melhor para testar como ficará em produção com autenticação e sincronização.

#### **Passo 1: Criar Projeto no Supabase**

```bash
# 1. Acesse https://app.supabase.com no navegador
# 2. Faça login ou crie uma conta (grátis)
# 3. Clique em "New Project"
# 4. Preencha:
#    - Nome: vidaleve (ou outro nome)
#    - Database Password: escolha uma senha forte (SALVE ISSO!)
#    - Region: South America (São Paulo) - mais próximo do Brasil
# 5. Aguarde ~2 minutos para o projeto ser criado
```

#### **Passo 2: Executar o Schema SQL**

```bash
# No painel do Supabase:
# 1. Vá em "SQL Editor" (menu lateral)
# 2. Clique em "New Query"
# 3. Abra o arquivo no seu terminal:
cat /home/user/NutriVision/supabase/schema.sql

# 4. Copie TODO o conteúdo do arquivo
# 5. Cole no editor SQL do Supabase
# 6. Clique em "Run" (ou Ctrl+Enter)
# 7. Aguarde a mensagem de sucesso ✅
```

#### **Passo 3: Obter Credenciais**

```bash
# No painel do Supabase:
# 1. Vá em "Settings" > "API" (menu lateral)
# 2. Copie dois valores:
#    - Project URL (ex: https://abc123.supabase.co)
#    - anon public key (uma string longa)
```

#### **Passo 4: Configurar Variáveis de Ambiente**

```bash
# 1. Crie o arquivo .env
cd /home/user/NutriVision
cp .env.example .env

# 2. Edite o arquivo .env
nano .env

# 3. Adicione suas credenciais:
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY_AQUI

# 4. Salve (Ctrl+O, Enter, Ctrl+X no nano)
```

#### **Passo 5: Iniciar o App**

```bash
# Reinicie o servidor para carregar as variáveis
npm run dev
```

**O que acontece:**
- ✅ App inicia em `http://localhost:5173`
- ✅ Mostra tela de **Login/Registro**
- ✅ Pode criar conta nova
- ✅ Dados salvos no Supabase (nuvem)
- ✅ Sincroniza entre dispositivos
- ✅ Autenticação funcionando
- ✅ Logout disponível

**Funcionalidades adicionais:**
- ✅ Tudo da Opção 1 +
- ✅ Login/Logout
- ✅ Recuperação de senha
- ✅ Sincronização em nuvem
- ✅ Multi-device (abre em outro navegador e vê os mesmos dados)
- ✅ Google OAuth (se configurar)

---

## 🧭 Fluxo de Teste Sugerido

### **Teste 1: Onboarding** (5 minutos)

1. Abra o app
2. Veja o Splash Screen animado
3. Passe pelas 4 telas de onboarding
4. Preencha o formulário de perfil:
   - Nome: Seu nome
   - Idade: 30 (exemplo)
   - Peso: 70 kg
   - Altura: 170 cm
   - Cintura: 80 cm
   - Quadril: 95 cm
   - Gênero: Feminino/Masculino
   - Atividade: Moderada
   - Objetivo: Perda de peso
5. Clique em Finalizar
6. ✅ Deve ir para o Dashboard

### **Teste 2: Dashboard** (3 minutos)

1. Veja suas métricas:
   - IMC calculado
   - Tipo corporal (Maçã/Pêra/Misto)
   - Metas de calorias e macros
2. Veja o progresso do dia (0/2000 calorias)
3. Veja os círculos de macronutrientes
4. Veja as dicas personalizadas
5. Veja o rastreador de água

### **Teste 3: Adicionar Refeição** (5 minutos)

1. Clique no botão "+" flutuante
2. Ou clique na aba "Adicionar"
3. Teste os 4 métodos:

   **A. Texto:**
   - Digite: "200g de frango grelhado com 100g de arroz integral"
   - Clique em Analisar
   - Veja os resultados (mockados por enquanto)
   - Clique em Adicionar

   **B. Foto:**
   - Clique em "Foto"
   - Tire uma foto ou escolha da galeria
   - Veja o preview
   - Clique em Analisar (mock)

   **C. Código de Barras:**
   - Clique em "Barcode"
   - Escaneie um código de barras (ou use um teste)
   - Veja os dados reais do Open Food Facts
   - Adicione a refeição

   **D. Voz:**
   - Clique em "Voz"
   - Fale: "Comi uma banana"
   - Veja a transcrição
   - Analise e adicione

### **Teste 4: Receitas** (3 minutos)

1. Vá para a aba "Receitas"
2. Veja as 6 receitas disponíveis
3. Use os filtros:
   - Por tipo: Café da manhã, Almoço, Jantar
   - Por tags: Vegano, Low-carb, etc.
4. Clique em uma receita
5. Veja detalhes completos
6. Clique no ícone de som 🔊 para ouvir a receita
7. Adicione aos favoritos ⭐

### **Teste 5: Progresso** (2 minutos)

1. Vá para a aba "Progresso"
2. Veja gráficos (vazios inicialmente)
3. Veja estatísticas semanais
4. Veja conquistas
5. (Adicione mais refeições para popular os gráficos)

### **Teste 6: Perfil** (3 minutos)

1. Vá para a aba "Perfil"
2. Veja todas suas métricas
3. Clique em "Editar Medidas"
4. Altere peso/cintura/quadril
5. Clique em Salvar
6. Veja métricas recalculadas automaticamente
7. Role até o fim
8. (Se configurou Supabase) Clique em "Sair"

---

## 🔍 Verificações de Qualidade

### **Checklist de Funcionalidades:**

- [ ] Splash screen aparece
- [ ] Onboarding com 4 telas
- [ ] Formulário de perfil valida dados
- [ ] Dashboard mostra métricas corretas
- [ ] Adicionar refeição por texto funciona
- [ ] Adicionar refeição por foto funciona
- [ ] Scanner de barcode funciona
- [ ] Entrada por voz funciona
- [ ] Receitas aparecem e são filtráveis
- [ ] Text-to-speech lê receitas
- [ ] Gráficos de progresso aparecem
- [ ] Rastreador de água funciona
- [ ] Perfil mostra dados corretos
- [ ] Edição de medidas funciona
- [ ] Dark mode funciona
- [ ] App responsivo (redimensione janela)
- [ ] PWA instalável

### **Checklist de Auth (se Supabase configurado):**

- [ ] Tela de login aparece
- [ ] Registro de novo usuário funciona
- [ ] Login funciona
- [ ] Esqueci senha envia email
- [ ] Dados sincronizam com Supabase
- [ ] Logout funciona
- [ ] Relogin mantém dados

---

## 🐛 Troubleshooting

### **Problema: App não inicia**
```bash
# Verifique se as dependências estão instaladas
npm install

# Tente novamente
npm run dev
```

### **Problema: Erro de porta em uso**
```bash
# O Vite vai sugerir outra porta automaticamente
# Ou force uma porta específica:
npm run dev -- --port 3000
```

### **Problema: Supabase não conecta**
```bash
# Verifique o arquivo .env
cat .env

# Deve ter:
# VITE_SUPABASE_URL=https://...
# VITE_SUPABASE_ANON_KEY=...

# Reinicie o servidor
# Ctrl+C para parar
npm run dev
```

### **Problema: Erros no console**
- Abra DevTools (F12)
- Vá na aba Console
- Compartilhe os erros se precisar de ajuda

---

## 📱 Testar em Dispositivos Móveis

### **Na mesma rede WiFi:**

```bash
# 1. Inicie o servidor
npm run dev

# 2. O Vite mostrará algo como:
#    Local:   http://localhost:5173
#    Network: http://192.168.1.100:5173

# 3. No celular, acesse o endereço Network
#    (ex: http://192.168.1.100:5173)
```

### **Como PWA (App Instalável):**

```bash
# 1. Acesse o app no celular
# 2. No navegador, clique em "Adicionar à tela inicial"
# 3. O app será instalado como se fosse nativo!
```

---

## 🎯 Dados de Teste Sugeridos

### **Perfil de Teste:**
- **Nome:** Ana Silva
- **Idade:** 32 anos
- **Peso:** 68 kg
- **Altura:** 165 cm
- **Cintura:** 78 cm
- **Quadril:** 98 cm
- **Gênero:** Feminino
- **Atividade:** Moderadamente ativo
- **Fase:** Ciclo regular
- **Objetivo:** Perda de peso

**Resultado esperado:**
- IMC: ~25 (Sobrepeso)
- Tipo: Pêra (quadril > cintura)
- Calorias: ~1500 kcal/dia
- Macros: 30% proteína, 40% carbs, 30% gordura

### **Refeições de Teste:**

**Café da manhã:**
- "2 ovos mexidos com 1 fatia de pão integral e café sem açúcar"

**Almoço:**
- "150g de peito de frango grelhado, 100g de arroz integral, salada verde"

**Lanche:**
- "1 maçã média com 10 amêndoas"

**Jantar:**
- "Omelete de 2 ovos com legumes e queijo branco"

---

## 📊 Próximos Passos Após Testar

1. **Funcionou tudo?** → Pronto para deploy!
2. **Achou bugs?** → Anote e podemos corrigir
3. **Quer customizar?** → Podemos ajustar
4. **Pronto para produção?** → Vamos para Sprint 2 (Pagamentos)

---

## 💡 Dicas

- Use **Chrome ou Edge** para melhor compatibilidade
- Teste em **modo anônimo** para simular primeiro acesso
- Use **DevTools** (F12) para ver logs
- **Dark mode**: Teste alternando no sistema operacional
- **Responsivo**: Redimensione a janela para ver adaptação

---

Boa sorte com os testes! 🚀
