# 🚀 Guia de Setup do Supabase - VidaLeve

## ✅ O que foi implementado (Sprint 1 - Backend + Auth)

### 1. **Configuração do Cliente Supabase**
- ✅ `src/lib/supabase.ts` - Cliente configurado com auto-refresh e persist session
- ✅ `src/lib/supabase-types.ts` - Tipos TypeScript do banco de dados
- ✅ `.env.example` - Variáveis de ambiente documentadas

### 2. **Schema do Banco de Dados**
- ✅ `supabase/schema.sql` - Schema SQL completo com:
  - Tabela `profiles` (perfil do usuário)
  - Tabela `meals` (refeições)
  - Tabela `body_metrics` (métricas corporais ao longo do tempo)
  - Tabela `daily_water` (rastreamento de água)
  - Tabela `recipes_favorites` (receitas favoritas)
  - Row Level Security (RLS) em todas as tabelas
  - Indexes para performance
  - Triggers para updated_at
  - Views para daily_summary

### 3. **Serviços de Backend**
- ✅ `src/services/authService.ts` - Autenticação completa:
  - Sign up com email/senha
  - Sign in com email/senha
  - Sign in com Google OAuth
  - Sign out
  - Password reset
  - Auth state listener

- ✅ `src/services/profileService.ts` - CRUD de perfis:
  - Criar perfil
  - Ler perfil
  - Atualizar perfil
  - Deletar perfil

- ✅ `src/services/mealsService.ts` - CRUD de refeições:
  - Criar refeição
  - Listar refeições (todas, por data, hoje)
  - Atualizar refeição
  - Deletar refeição

- ✅ `src/services/bodyMetricsService.ts` - Tracking de métricas:
  - Salvar métricas
  - Histórico de métricas
  - Métricas mais recentes

- ✅ `src/services/waterService.ts` - Tracking de água:
  - Adicionar água
  - Atualizar intake diário
  - Histórico de hidratação

### 4. **Páginas de Autenticação**
- ✅ `src/pages/Login.tsx` - Página de login com:
  - Email/senha
  - Login com Google
  - Link para registro
  - Link para recuperação de senha
  - Error handling
  - Loading states

- ✅ `src/pages/Register.tsx` - Página de cadastro com:
  - Nome, email, senha, confirmar senha
  - Validação de formulário
  - Registro com Google
  - Link para login
  - Termos de uso

---

## 🔧 Como Configurar o Supabase

### **Passo 1: Criar Projeto no Supabase**

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Preencha:
   - Nome: `vidaleve`
   - Database Password: (escolha uma senha forte)
   - Region: South America (São Paulo) ou mais próxima
4. Aguarde ~2 minutos para o projeto ser criado

### **Passo 2: Executar o Schema SQL**

1. No painel do Supabase, vá em `SQL Editor`
2. Clique em `New Query`
3. Copie todo o conteúdo de `supabase/schema.sql`
4. Cole no editor
5. Clique em `Run` (ou `Ctrl+Enter`)
6. Aguarde a mensagem de sucesso

### **Passo 3: Configurar Autenticação**

1. No painel, vá em `Authentication` > `Providers`
2. **Email**: Já está habilitado por padrão
3. **Google OAuth** (opcional):
   - Ative o provider Google
   - Configure as credenciais OAuth:
     - Vá em [Google Cloud Console](https://console.cloud.google.com)
     - Crie um projeto ou use existente
     - Ative Google+ API
     - Crie credenciais OAuth 2.0
     - Adicione redirect URI: `https://SEU_PROJECT_ID.supabase.co/auth/v1/callback`
     - Copie Client ID e Client Secret para o Supabase

### **Passo 4: Configurar Variáveis de Ambiente**

1. No painel do Supabase, vá em `Settings` > `API`
2. Copie:
   - `Project URL`
   - `anon` `public` key

3. Crie um arquivo `.env` na raiz do projeto:
```bash
cp .env.example .env
```

4. Edite o `.env` e adicione suas credenciais:
```bash
VITE_SUPABASE_URL=https://seuprojectid.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### **Passo 5: Testar a Conexão**

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Iniciar o app
npm run dev
```

---

## 📋 Próximos Passos (O que ainda falta)

### **1. Integrar Auth no App.tsx** ⚠️ PENDENTE
- [ ] Criar `AuthFlow` component para gerenciar Login/Register/ForgotPassword
- [ ] Modificar `App.tsx` para:
  - Checar autenticação no mount
  - Mostrar AuthFlow se não autenticado
  - Carregar perfil do usuário do Supabase
  - Sincronizar dados do Supabase → Zustand store

### **2. Migrar Zustand Store para Supabase** ⚠️ PENDENTE
- [ ] Atualizar `useAppStore.ts`:
  - Remover `persist` middleware (dados virão do Supabase)
  - Adicionar métodos async para sync com Supabase
  - Carregar dados do usuário ao fazer login
  - Salvar mudanças no Supabase em tempo real

### **3. Sincronização de Dados** ⚠️ PENDENTE
- [ ] Ao adicionar refeição → salvar no Supabase
- [ ] Ao atualizar perfil → salvar no Supabase
- [ ] Ao adicionar água → salvar no Supabase
- [ ] Carregar dados ao fazer login
- [ ] Implementar offline-first (salvar local e sync depois)

### **4. Onboarding Integrado** ⚠️ PENDENTE
- [ ] Após registro, criar perfil no Supabase
- [ ] Salvar dados do onboarding no Supabase
- [ ] Calcular e salvar body_metrics iniciais

### **5. Profile Page** ⚠️ PENDENTE
- [ ] Adicionar botão de "Sair"
- [ ] Salvar alterações de perfil no Supabase
- [ ] Deletar conta (com confirmação)

### **6. Storage de Imagens** ⚠️ PENDENTE
- [ ] Configurar Supabase Storage
- [ ] Upload de fotos de refeições
- [ ] Upload de foto de perfil

### **7. Testing** ⚠️ PENDENTE
- [ ] Testar fluxo de registro
- [ ] Testar fluxo de login
- [ ] Testar sincronização de dados
- [ ] Testar offline/online
- [ ] Testar RLS (segurança)

---

## 🔒 Segurança (Row Level Security)

O schema já inclui RLS em todas as tabelas. Isso significa:

✅ **Usuários só podem ver seus próprios dados**
- Um usuário não consegue acessar refeições de outro
- Cada query é automaticamente filtrada por `user_id`
- Supabase valida isso no backend

✅ **Proteção contra SQL Injection**
- Supabase usa prepared statements
- Nunca concatenamos SQL manualmente

✅ **Tokens JWT**
- Sessões são seguras com JWT
- Tokens expiram automaticamente
- Refresh tokens gerenciados automaticamente

---

## 💰 Custos do Supabase

### **Free Tier** (Recomendado para começar)
- ✅ 500MB de database storage
- ✅ 1GB de file storage
- ✅ 2GB de bandwidth/mês
- ✅ 50.000 monthly active users
- ✅ Autenticação ilimitada
- ✅ Row Level Security
- ✅ Backups automáticos (7 dias)

**Suficiente para**: Até ~1.000 usuários ativos

### **Pro Tier** ($25/mês)
- ✅ 8GB database storage
- ✅ 100GB file storage
- ✅ 50GB bandwidth/mês
- ✅ 100.000 monthly active users
- ✅ Tudo do Free Tier
- ✅ Backups automáticos (30 dias)
- ✅ Suporte prioritário

**Suficiente para**: 1.000-10.000 usuários

---

## 🎯 Estimativa de Tempo

### **Fase 1A: Já Implementado** ✅
- Setup Supabase: ✅ Completo
- Schema SQL: ✅ Completo
- Serviços: ✅ Completo
- Auth Pages: ✅ Completo

**Tempo gasto**: ~6-8 horas

### **Fase 1B: Integração** ⚠️ PENDENTE
- AuthFlow component: 2h
- App.tsx integration: 3h
- Zustand migration: 4h
- Testing: 2h

**Tempo estimado**: ~11 horas (1-2 dias)

---

## 📚 Recursos Úteis

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## 🆘 Troubleshooting

### **Erro: "Invalid API key"**
- Verifique se copiou a chave correta do Supabase
- Verifique se o `.env` está na raiz do projeto
- Reinicie o servidor de dev (`npm run dev`)

### **Erro: "relation does not exist"**
- Execute o `schema.sql` no SQL Editor do Supabase
- Verifique se todas as tabelas foram criadas

### **Erro: "new row violates row-level security policy"**
- Verifique se o usuário está autenticado
- Verifique se o `user_id` está sendo passado corretamente

### **OAuth não funciona**
- Verifique as credenciais do Google Cloud
- Verifique a redirect URI
- Teste em ambiente de produção (OAuth pode não funcionar em localhost)

---

## ✅ Checklist de Deploy

Antes de ir para produção:

- [ ] Executar schema.sql no Supabase
- [ ] Configurar variáveis de ambiente
- [ ] Testar autenticação (email + OAuth)
- [ ] Testar RLS (tentar acessar dados de outro usuário)
- [ ] Configurar Google OAuth (produção)
- [ ] Habilitar email confirmations (opcional)
- [ ] Configurar domínio customizado (opcional)
- [ ] Configurar SMTP para emails (opcional)
- [ ] Backup do database
- [ ] Monitoring (Supabase Dashboard)

---

**Status do Sprint 1**: **80% Completo** 🎯

**Próximo passo**: Integrar Auth no App.tsx e migrar Zustand para Supabase
