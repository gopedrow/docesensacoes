# 🗄️ Inicializar Banco de Dados no Render

## ⚠️ Problema Identificado
O banco de dados não estava inicializado corretamente, causando erros no cadastro de usuários.

## 🔧 Solução

### 1. Acessar o Render Dashboard
1. Vá para [render.com](https://render.com)
2. Faça login na sua conta
3. Acesse o projeto `docesensacoes-2`

### 2. Executar Script de Inicialização

#### Opção A: Via Console do Render
1. No dashboard do Render, clique no seu serviço `docesensacoes-2`
2. Vá para a aba **"Shell"**
3. Execute o comando:
```bash
node scripts/init-database.js
```

#### Opção B: Via Deploy Manual
1. No dashboard do Render, clique em **"Manual Deploy"**
2. Selecione **"Clear build cache & deploy"**
3. Aguarde o deploy completar

### 3. Verificar Inicialização

Após executar o script, você deve ver:
```
🚀 Iniciando inicialização do banco de dados...
✅ Banco de dados inicializado com sucesso!
📋 Tabelas criadas:
   - users (usuários)
   - products (produtos)
   - orders (pedidos)
   - order_items (itens dos pedidos)
   - reviews (avaliações)

👤 Usuário admin criado:
   Email: admin@docesensacoes.com
   Senha: admin123

🍰 Produtos de exemplo inseridos
🎉 Inicialização concluída!
```

## 🧪 Testar o Sistema

### 1. Testar Cadastro
- Acesse: `https://docesensacoes.vercel.app/src/pages/cadastro.html`
- Tente criar uma nova conta
- Deve funcionar sem erros

### 2. Testar Login
- Acesse: `https://docesensacoes.vercel.app/src/pages/login.html`
- Use as credenciais:
  - **Email:** `admin@docesensacoes.com`
  - **Senha:** `admin123`

### 3. Teste Completo
- Acesse: `https://docesensacoes.vercel.app/teste-autenticacao-completo.html`
- Execute todos os testes de autenticação

## 📋 Estrutura do Banco

### Tabelas Criadas:
- **users** - Usuários do sistema
- **products** - Produtos do cardápio
- **orders** - Pedidos dos clientes
- **order_items** - Itens de cada pedido
- **reviews** - Avaliações dos produtos

### Usuário Admin Padrão:
- **Email:** `admin@docesensacoes.com`
- **Senha:** `admin123`
- **Tipo:** Administrador

### Produtos de Exemplo:
- Bolo de Chocolate - R$ 45,90
- Trufa de Morango - R$ 8,50
- Brigadeiro Gourmet - R$ 3,50
- Torta de Limão - R$ 35,00
- Cookie de Chocolate - R$ 2,50

## 🔍 Verificar Status

Para verificar se tudo está funcionando:

```bash
# Testar API
curl https://docesensacoes-2.onrender.com/api/test

# Testar cadastro
curl -X POST https://docesensacoes-2.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@teste.com","password":"123456","phone":"(11) 99999-9999","address":"Rua Teste, 123"}'
```

## ✅ Resultado Esperado

Após a inicialização:
- ✅ Cadastro de usuários funcionando
- ✅ Login funcionando
- ✅ Sistema de autenticação completo
- ✅ Produtos carregando no cardápio
- ✅ Painel admin acessível

## 🆘 Se Houver Problemas

1. **Verificar logs do Render:**
   - Dashboard → Logs → Verificar erros

2. **Verificar variáveis de ambiente:**
   - Dashboard → Environment → Verificar DATABASE_URL

3. **Reiniciar o serviço:**
   - Dashboard → Manual Deploy → Clear cache & deploy

4. **Contatar suporte:**
   - Se o problema persistir, verificar configurações do PostgreSQL 