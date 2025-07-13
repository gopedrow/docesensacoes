# 🔧 Solução para Problema de Cadastro de Usuários

## ⚠️ Problema Identificado
Erro "Erro ao criar conta. Tente novamente." ao tentar cadastrar novos usuários.

## 🎯 Solução Rápida (Sem Shell)

### **Opção 1: Usar Página de Debug (Recomendada)**

1. **Acesse a página de debug:**
   ```
   http://localhost:8000/teste-cadastro-debug.html
   ```

2. **Siga os passos na ordem:**
   - ✅ **Passo 1:** Testar API
   - ✅ **Passo 2:** Inicializar Banco
   - ✅ **Passo 3:** Testar Cadastro Manual
   - ✅ **Passo 4:** Testar Login Admin
   - ✅ **Passo 5:** Executar Solução Automática (se necessário)

### **Opção 2: Solução Automática via API**

Execute estes comandos em sequência:

```bash
# 1. Testar API
curl -X GET https://docesensacoes-2.onrender.com/api/test

# 2. Inicializar banco
curl -X POST https://docesensacoes-2.onrender.com/api/init-database

# 3. Testar cadastro
curl -X POST https://docesensacoes-2.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuário Teste",
    "email": "teste@exemplo.com",
    "password": "123456",
    "phone": "(11) 99999-9999",
    "address": "Rua Teste, 123"
  }'
```

## 🔍 Diagnóstico do Problema

### Possíveis Causas:

1. **Banco não inicializado** - Tabelas não existem
2. **API offline** - Servidor não está rodando
3. **CORS** - Problema de permissões
4. **Dados inválidos** - Validação falhando
5. **Email duplicado** - Usuário já existe

### Verificações:

1. **Status da API:**
   ```
   GET https://docesensacoes-2.onrender.com/api/test
   ```

2. **Estrutura do banco:**
   ```
   POST https://docesensacoes-2.onrender.com/api/init-database
   ```

3. **Teste de cadastro:**
   ```
   POST https://docesensacoes-2.onrender.com/api/auth/register
   ```

## 🛠️ Soluções Específicas

### **Se a API não responde:**
1. Acesse [render.com](https://render.com)
2. Vá para o projeto `docesensacoes-2`
3. Clique em **"Manual Deploy"**
4. Selecione **"Clear build cache & deploy"**
5. Aguarde o deploy completar

### **Se o banco não inicializa:**
1. Verifique as variáveis de ambiente no Render
2. Confirme que `DATABASE_URL` está configurada
3. Execute a inicialização via API novamente

### **Se o cadastro falha:**
1. Use email único (gerar automaticamente)
2. Verifique se todos os campos obrigatórios estão preenchidos
3. Teste com dados mínimos primeiro

## 📋 Dados de Teste

### **Usuário Admin Padrão:**
- **Email:** `admin@docesensacoes.com`
- **Senha:** `admin123`

### **Dados para Teste:**
```json
{
  "name": "Usuário Teste",
  "email": "teste@exemplo.com",
  "password": "123456",
  "phone": "(11) 99999-9999",
  "address": "Rua Teste, 123"
}
```

## 🚀 Após a Correção

1. **Teste o cadastro no site:**
   ```
   https://docesensacoes.vercel.app/src/pages/cadastro.html
   ```

2. **Teste o login:**
   ```
   https://docesensacoes.vercel.app/src/pages/login.html
   ```

3. **Verifique o painel admin:**
   ```
   https://docesensacoes.vercel.app/src/pages/admin-dashboard.html
   ```

## 🔧 Ferramentas de Debug

### **Páginas de Teste Disponíveis:**

1. **Debug Completo:**
   ```
   http://localhost:8000/teste-cadastro-debug.html
   ```

2. **Inicialização do Banco:**
   ```
   http://localhost:8000/inicializar-banco.html
   ```

3. **Teste de Autenticação:**
   ```
   http://localhost:8000/teste-autenticacao-completo.html
   ```

## ✅ Checklist de Verificação

- [ ] API respondendo (`/api/test`)
- [ ] Banco inicializado (`/api/init-database`)
- [ ] Cadastro funcionando (`/api/auth/register`)
- [ ] Login funcionando (`/api/auth/login`)
- [ ] Site acessível
- [ ] Formulário de cadastro funcionando
- [ ] Mensagens de erro claras

## 🆘 Se o Problema Persistir

1. **Verificar logs do Render:**
   - Dashboard → Logs → Verificar erros

2. **Verificar variáveis de ambiente:**
   - Dashboard → Environment → Verificar DATABASE_URL

3. **Reiniciar o serviço:**
   - Dashboard → Manual Deploy → Clear cache & deploy

4. **Usar página de debug:**
   - Acesse `http://localhost:8000/teste-cadastro-debug.html`
   - Execute a solução automática

5. **Contatar suporte:**
   - Se o problema persistir, verificar configurações do PostgreSQL

## 🎯 Resultado Esperado

Após a correção:
- ✅ Cadastro de usuários funcionando
- ✅ Login funcionando
- ✅ Sistema de autenticação completo
- ✅ Mensagens de erro claras
- ✅ Redirecionamento correto após cadastro

---

**💡 Dica:** Use sempre a página de debug para identificar e resolver problemas rapidamente! 