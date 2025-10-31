# 🔧 Troubleshooting - Vercel Deploy

## 🎯 Passo a Passo para Resolver

### **Passo 1: Verificar Status do Deployment**

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **"NutriVision"** (ou nome que você deu)
3. Vá na aba **"Deployments"**
4. Veja o deployment mais recente:
   - ✅ **Ready** (verde) = Deploy funcionou
   - ⚠️ **Building** (amarelo) = Ainda processando, aguarde
   - ❌ **Failed** (vermelho) = Deu erro

### **Passo 2: Se está "Ready" mas não abre**

**A. Verifique a URL correta:**
- Clique no deployment com ✅
- Copie a URL que aparece no topo
- Cole em uma **nova aba anônima** (Ctrl+Shift+N)
- Tente acessar

**B. Verifique se o Build Command está correto:**
1. No projeto, vá em **Settings** → **General**
2. Role até **"Build & Development Settings"**
3. Verifique:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

**C. Se estiver tudo certo, force um novo deploy:**
1. Vá em **Deployments**
2. Clique no deployment mais recente
3. Clique nos **3 pontinhos (⋮)** no canto superior direito
4. Clique em **"Redeploy"**
5. Aguarde 2-3 minutos
6. Tente acessar novamente

### **Passo 3: Se está "Failed" (Erro)**

1. Clique no deployment com ❌
2. Role até **"Deployment Summary"**
3. Veja os logs de erro
4. Me mande uma captura de tela ou copie o erro aqui

**Erros comuns:**

**Erro: "Build failed"**
```
Solução:
1. Settings → General → Node.js Version
2. Mude para 18.x ou 20.x
3. Redeploy
```

**Erro: "Command not found: vite"**
```
Solução:
1. Settings → General → Install Command
2. Certifique que está: npm install
3. Redeploy
```

**Erro: "Directory not found: dist"**
```
Solução:
1. Settings → General → Output Directory
2. Mude para: dist
3. Redeploy
```

### **Passo 4: Verificar Browser**

**A. Limpar cache:**
```
Chrome/Edge: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
Safari: Cmd + Shift + Delete

→ Marcar "Cached images and files"
→ Limpar
→ Tentar novamente
```

**B. Testar em modo anônimo:**
```
Chrome: Ctrl + Shift + N
Firefox: Ctrl + Shift + P
Edge: Ctrl + Shift + N
Safari: Cmd + Shift + N

→ Acessar a URL do Vercel
```

**C. Testar em outro navegador:**
- Se usa Chrome, tente Firefox
- Se usa Firefox, tente Chrome
- Ou Edge, Safari, etc.

### **Passo 5: Verificar Extensões do Navegador**

Algumas extensões podem bloquear:
- Ad blockers (uBlock Origin, AdBlock)
- Privacy extensions (Privacy Badger)
- Script blockers (NoScript)

**Teste:**
1. Desabilite todas extensões temporariamente
2. Tente acessar o app
3. Se funcionar, reative uma por uma para encontrar a culpada

### **Passo 6: Verificar Rede/Firewall**

**A. Teste sua conexão:**
- Acesse: https://vercel.com (se abrir, conexão OK)
- Acesse: https://google.com (teste básico)

**B. Se estiver em rede corporativa/escola:**
- Firewall pode estar bloqueando
- Tente usando:
  - Dados móveis (4G/5G)
  - Outra rede WiFi
  - VPN

**C. Antivírus/Firewall local:**
- Temporariamente desabilite antivírus
- Teste novamente
- Se funcionar, adicione Vercel às exceções

---

## 🔍 Diagnóstico Rápido

**Copie e cole isso no seu navegador para testar:**

```
1. https://vercel.com
   → Se não abrir: problema de rede/firewall
   → Se abrir: próximo teste

2. Sua URL do Vercel (ex: https://nutrivision-xxx.vercel.app)
   → Se não abrir: problema de deploy ou configuração
   → Se abrir: problema de cache do navegador
```

---

## 📸 Me Envie Screenshots de:

Para eu te ajudar melhor, tire print de:

1. **Página de Deployments no Vercel:**
   - Mostrando status do último deployment

2. **Build Logs (se deu erro):**
   - A tela de erro completa

3. **Settings → General:**
   - Build & Development Settings

4. **Erro no navegador:**
   - A mensagem de erro completa que aparece

---

## ✅ Checklist de Verificação

- [ ] Deployment está "Ready" (verde) no Vercel
- [ ] URL copiada corretamente (sem espaços)
- [ ] Testei em modo anônimo
- [ ] Testei em outro navegador
- [ ] Cache limpo
- [ ] Extensões desabilitadas
- [ ] Não estou em rede bloqueada
- [ ] Build Command é `npm run build`
- [ ] Output Directory é `dist`
- [ ] Framework Preset é `Vite`

---

## 🆘 Se Nada Funcionar

**Alternativa 1: GitHub Pages** (vou configurar para você)
**Alternativa 2: Netlify** (manual, mas pode funcionar melhor)
**Alternativa 3: Cloudflare Pages** (rápido e confiável)

Me avise e configuramos outra opção! 😊
