# 🚀 Deploy Rápido - VidaLeve

## Deploy no Vercel (3 minutos)

O Vercel é uma plataforma gratuita que hospeda apps React/Vite gratuitamente.

### **Passo 1: Acesse o Vercel**

1. Vá para: https://vercel.com
2. Clique em **"Sign Up"** (ou "Login" se já tiver conta)
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

### **Passo 2: Importar o Projeto**

1. No dashboard do Vercel, clique em **"Add New..."** → **"Project"**
2. Você verá uma lista dos seus repositórios do GitHub
3. Procure por **"NutriVision"**
4. Clique em **"Import"**

### **Passo 3: Configurar**

1. **Framework Preset**: Vite (deve detectar automaticamente)
2. **Build Command**: `npm run build` (já preenchido)
3. **Output Directory**: `dist` (já preenchido)
4. **Install Command**: `npm install` (já preenchido)

5. **Environment Variables** (OPCIONAL - só se quiser Supabase):
   - Clique em "Environment Variables"
   - Adicione:
     - Key: `VITE_SUPABASE_URL` → Value: `sua_url_do_supabase`
     - Key: `VITE_SUPABASE_ANON_KEY` → Value: `sua_chave_do_supabase`

6. Clique em **"Deploy"**

### **Passo 4: Aguardar**

- O Vercel vai:
  1. Clonar seu repositório
  2. Instalar dependências
  3. Rodar o build
  4. Fazer deploy

- Leva **~2 minutos**

### **Passo 5: Acessar!** 🎉

Quando terminar, você verá:

```
✅ Deployment Ready!
Your site is live at: https://nutrivision-xxx.vercel.app
```

**Pronto!** Acesse a URL e use o app!

---

## Deploy no Netlify (Alternativa)

Se preferir o Netlify:

1. Vá para: https://app.netlify.com
2. Faça login com GitHub
3. Clique em **"Add new site"** → **"Import an existing project"**
4. Escolha **GitHub**
5. Selecione o repositório **NutriVision**
6. Configure:
   - Branch: `claude/saas-nutrition-app-mvp-011CUcdsCUVbnxTPHhJpXozi`
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Clique em **"Deploy site"**

---

## Configurar Variáveis de Ambiente (Depois)

Se quiser adicionar Supabase depois:

### **No Vercel:**
1. Vá no seu projeto
2. Settings → Environment Variables
3. Adicione as variáveis
4. Redeploy (Deploy → Redeploy)

### **No Netlify:**
1. Site settings → Environment variables
2. Add a variable
3. Redeploy

---

## Deploy Manual (Qualquer Host)

Se quiser usar outro serviço (seu servidor, DigitalOcean, etc.):

1. O build está em `/dist/`
2. É só HTML/CSS/JS estático
3. Suba esses arquivos para qualquer servidor web
4. Configure para servir `index.html` em todas as rotas (SPA)

### **Exemplo nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## URLs Geradas

Depois do deploy, você terá URLs como:

- **Vercel**: `https://vidaleve-xxxx.vercel.app`
- **Netlify**: `https://vidaleve-xxxx.netlify.app`

Você pode configurar um **domínio customizado** depois!

---

## Troubleshooting

### **Build falhou**
- Verifique os logs no painel do Vercel/Netlify
- Geralmente é por falta de variáveis de ambiente
- Ou alguma dependência faltando

### **App carrega mas dá erro**
- Verifique as variáveis de ambiente
- Abra o Console do navegador (F12)
- Veja se tem erros de CORS ou API

### **Supabase não funciona**
- Verifique se adicionou as variáveis de ambiente
- Verifique se a URL do Supabase está correta
- Veja se habilitou CORS no Supabase

---

## Próximos Passos

Após o deploy:

1. **Teste o app** na URL pública
2. **Compartilhe** com amigos/clientes
3. **Configure domínio customizado** (ex: vidaleve.com)
4. **Habilite analytics** (Vercel/Netlify têm integrados)
5. **Configure CI/CD** (já está automático!)

Qualquer commit novo na branch `claude/saas-nutrition-app-mvp-*` vai fazer **redeploy automático**! 🎉

---

**Dúvidas?** Me chame! 😊
