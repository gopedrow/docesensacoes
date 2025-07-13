# 🗄️ Inicializar Banco de Dados no Render (Sem Shell)

## ⚠️ Problema Identificado
O banco de dados não estava inicializado corretamente, causando erros no cadastro de usuários. A aba Shell é um recurso pago no Render.

## 🔧 Solução (Sem Shell)

### **Opção 1: Inicialização Automática (Recomendada)**
O servidor agora inicializa o banco automaticamente na primeira execução.

1. **Fazer Deploy Manual:**
   - Acesse [render.com](https://render.com)
   - Vá para o projeto `docesensacoes-2`
   - Clique em **"Manual Deploy"**
   - Selecione **"Clear build cache & deploy"**
   - Aguarde o deploy completar

2. **Verificar Logs:**
   - Após o deploy, vá para a aba **"Logs"**
   - Procure por estas mensagens:
   ```
   🔄 Verificando inicialização do banco de dados...
   ✅ Banco de dados inicializado automaticamente!
   ```

### **Opção 2: Inicialização via API**
Use a página de teste criada para inicializar o banco.

1. **Acessar página de teste:**
   ```
   http://localhost:8000/inicializar-banco.html
   ```

2. **Seguir os passos:**
   - Testar API
   - Inicializar Banco
   - Testar Cadastro
   - Testar Login

### **Opção 3: Inicialização Manual via API**
Execute via curl ou Postman:

```bash
# Inicializar banco
curl -X POST https://docesensacoes-2.onrender.com/api/init-database

# Testar cadastro
curl -X POST https://docesensacoes-2.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@teste.com","password":"123456","phone":"(11) 99999-9999","address":"Rua Teste, 123"}'
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

4. **Usar página de teste:**
   - Acesse `http://localhost:8000/inicializar-banco.html`
   - Execute os testes passo a passo

5. **Contatar suporte:**
   - Se o problema persistir, verificar configurações do PostgreSQL

## 🚀 Próximos Passos

1. **Fazer deploy manual** no Render
2. **Aguardar inicialização automática** (5 segundos após deploy)
3. **Testar o sistema** usando a página de teste
4. **Acessar o site oficial** e verificar funcionamento 