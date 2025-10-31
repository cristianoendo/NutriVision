# 🚀 Como Rodar o App no Seu Navegador

## Opção Mais Fácil: Rodar Localmente (5 minutos)

### **Pré-requisitos:**
Você precisa ter instalado:
- ✅ **Git** - [Download aqui](https://git-scm.com/downloads)
- ✅ **Node.js** (v18 ou superior) - [Download aqui](https://nodejs.org/)

**Como verificar se já tem:**
```bash
git --version
node --version
npm --version
```

Se aparecer versões, você já tem! Senão, instale primeiro.

---

## 📥 Passo 1: Clonar o Repositório

Abra seu terminal (Git Bash no Windows, Terminal no Mac/Linux) e cole:

```bash
cd ~
git clone https://github.com/cristianoendo/NutriVision.git
cd NutriVision
```

**Ou se você já tem o repo clonado em outro lugar, navegue até lá:**
```bash
cd /caminho/para/sua/pasta/NutriVision
```

---

## 🔄 Passo 2: Fazer Checkout da Branch Correta

```bash
git fetch origin
git checkout claude/saas-nutrition-app-mvp-011CUcdsCUVbnxTPHhJpXozi
git pull origin claude/saas-nutrition-app-mvp-011CUcdsCUVbnxTPHhJpXozi
```

**Ou se a branch é muito longa, use:**
```bash
git checkout -b local-test origin/claude/saas-nutrition-app-mvp-011CUcdsCUVbnxTPHhJpXozi
```

---

## 📦 Passo 3: Instalar Dependências

```bash
npm install
```

Isso vai baixar ~441 pacotes (demora 1-2 minutos). Aguarde terminar!

---

## 🚀 Passo 4: Iniciar o Servidor

```bash
npm run dev
```

**Você verá algo assim:**
```
  VITE v7.1.12  ready in 300 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/
```

---

## 🌐 Passo 5: Abrir no Navegador

1. **Copie a URL que apareceu** (provavelmente `http://localhost:3000/`)
2. **Cole no seu navegador** (Chrome, Firefox, Edge, Safari)
3. **Pronto!** 🎉

O app vai abrir automaticamente!

---

## 🧪 O Que Você Vai Ver

### **1. Splash Screen (2 segundos)**
Logo do VidaLeve com animação

### **2. Onboarding (4 slides)**
Apresentação do app

### **3. Formulário de Perfil**
Preencha seus dados:
- Nome
- Idade: 30 (exemplo)
- Peso: 70 kg
- Altura: 170 cm
- Cintura: 80 cm
- Quadril: 95 cm
- Gênero: Feminino/Masculino
- Atividade: Moderada
- Objetivo: Perda de peso

### **4. Dashboard**
Sua tela principal com:
- Progresso de calorias
- Macronutrientes
- Lista de refeições
- Rastreador de água

### **5. Explore!**
Use a navegação inferior para testar:
- ➕ Adicionar Refeição (tente todos os 4 métodos!)
- 📈 Progresso (gráficos)
- 🍽️ Receitas (clique no 🔊 para ouvir!)
- 👤 Perfil

---

## 🔥 Dicas de Teste

### **Teste 1: Adicionar Refeição por Texto**
1. Clique em ➕ (adicionar)
2. Digite: "200g frango grelhado, 100g arroz integral"
3. Clique em "Analisar com IA"
4. Veja os resultados
5. Clique em "Adicionar ao Diário"

### **Teste 2: Rastreador de Água**
1. No Dashboard
2. Role até "Rastreador de Água"
3. Clique no botão + várias vezes
4. Veja os copos preenchendo!

### **Teste 3: Receitas com Áudio** 🔊
1. Vá na aba "Receitas"
2. Clique em uma receita
3. Clique no botão 🔊
4. **O celular vai LER a receita em voz alta!** (muito legal!)

### **Teste 4: Dark Mode** 🌙
1. Vá em "Perfil"
2. Procure o toggle de tema
3. Alterne entre Light/Dark
4. Veja tudo mudar de cor!

### **Teste 5: Editar Perfil**
1. Vá em "Perfil"
2. Clique em "Editar Medidas"
3. Mude seu peso
4. Salve
5. Veja o IMC recalcular automaticamente!

---

## 🛑 Para Parar o Servidor

No terminal, pressione:
```
Ctrl + C
```

O servidor vai parar. Para iniciar novamente:
```
npm run dev
```

---

## 📱 Testar no Celular (Mesma Rede WiFi)

Se quiser testar no celular:

1. **No terminal, olhe a linha "Network":**
   ```
   ➜  Network: http://192.168.1.100:3000/
   ```

2. **No celular, conecte na MESMA rede WiFi**

3. **Abra o navegador do celular**

4. **Digite a URL Network** (ex: http://192.168.1.100:3000/)

5. **Pronto!** O app abre no celular! 📱

---

## 🐛 Troubleshooting

### **Problema: "npm: command not found"**
**Solução:** Instale o Node.js primeiro
- https://nodejs.org/ (baixe a versão LTS)

### **Problema: "git: command not found"**
**Solução:** Instale o Git primeiro
- https://git-scm.com/downloads

### **Problema: "Port 3000 is already in use"**
**Solução:** Outro programa está usando a porta. Use outra:
```bash
npm run dev -- --port 3001
```
Então acesse: http://localhost:3001/

### **Problema: "npm install" dá erro**
**Solução 1:** Limpe o cache e tente novamente
```bash
rm -rf node_modules package-lock.json
npm install
```

**Solução 2:** Atualize o Node.js para v18+

### **Problema: Página em branco no navegador**
**Solução:**
1. Abra o DevTools (F12)
2. Vá na aba Console
3. Veja se tem erros
4. Me mande o erro que eu te ajudo!

### **Problema: "Permission denied"**
**Solução (Mac/Linux):** Use sudo
```bash
sudo npm install
```

**Solução (Windows):** Execute o terminal como Administrador

---

## ✅ Checklist Rápido

- [ ] Git instalado (`git --version`)
- [ ] Node.js instalado (`node --version`)
- [ ] Repositório clonado (`git clone ...`)
- [ ] Branch correta (`git checkout ...`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador aberto em `http://localhost:3000/`
- [ ] App apareceu! 🎉

---

## 🎯 Próximos Passos Depois de Testar

1. **Se gostou:** Faça o deploy no GitHub Pages (já expliquei antes)
2. **Se encontrou bug:** Me avise para corrigir
3. **Se quer customizar:** Posso te ajudar com as mudanças

---

## 💡 Dica Pro

**Para desenvolvimento contínuo:**

```bash
# Terminal 1: Servidor sempre rodando
npm run dev

# Terminal 2: Para fazer mudanças
git pull  # atualiza código
# editar arquivos
# ver mudanças em tempo real no navegador (hot reload!)
```

O Vite tem **Hot Module Replacement (HMR)** - qualquer mudança no código atualiza o navegador INSTANTANEAMENTE! 🔥

---

**Dúvidas?** Me chame! 😊
