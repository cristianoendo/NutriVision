#!/bin/bash

echo "🌿 VidaLeve - Iniciando App para Teste"
echo "======================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

echo "📍 Documentação disponível:"
echo "  - GUIA_DE_TESTE.md       → Como testar o app"
echo "  - SUPABASE_SETUP.md      → Configurar Supabase (opcional)"
echo "  - ANALISE_COMPLETA.md    → Análise completa do projeto"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado"
    echo "   O app vai funcionar SEM Supabase (modo offline)"
    echo ""
    echo "   Para habilitar Supabase:"
    echo "   1. cp .env.example .env"
    echo "   2. Edite o .env com suas credenciais"
    echo "   3. Veja SUPABASE_SETUP.md para instruções"
    echo ""
else
    echo "✅ Arquivo .env encontrado"
    
    # Check if Supabase is configured
    if grep -q "your_supabase" .env 2>/dev/null; then
        echo "⚠️  Supabase ainda não configurado (.env com valores de exemplo)"
        echo "   O app vai funcionar em modo OFFLINE"
        echo ""
    else
        echo "✅ Supabase parece configurado!"
        echo ""
    fi
fi

echo "🚀 Iniciando servidor de desenvolvimento..."
echo ""
echo "   O app abrirá em: http://localhost:5173"
echo "   (ou outra porta se 5173 estiver ocupada)"
echo ""
echo "   Pressione Ctrl+C para parar o servidor"
echo ""
echo "======================================"
echo ""

npm run dev
