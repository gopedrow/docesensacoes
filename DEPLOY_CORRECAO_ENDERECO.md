# 🚀 Deploy da Correção da Coluna Endereço

## ✅ Correções Implementadas

### **1. Backend Corrigido (`routes/auth.js`)**

**Antes (causava erro 500):**
```javascript
// Inserir usuário
const result = await pool.query(
  `INSERT INTO users (name, email, password, phone, address, created_at, active)
   VALUES ($1, $2, $3, $4, $5, NOW(), true)
   RETURNING id, name, email, phone, address, created_at`,
  [name, email, hashedPassword, phone, address || '']
);
```

**Depois (corrigido):**
```javascript
// Inserir usuário (sem o campo address para evitar erro)
const result = await pool.query(
  `INSERT INTO users (name, email, password, phone, created_at, active)
   VALUES ($1, $2, $3, $4, NOW(), true)
   RETURNING id, name, email, phone, created_at`,
  [name, email, hashedPassword, phone]
);
```

### **2. Frontend Corrigido (`teste-correcao-endereco.html`)**

**Antes (enviando address):**
```javascript
const userData = {
    name: 'Teste',
    email: 'teste@exemplo.com',
    password: '123456',
    phone: '(11) 99999-9999',
    address: 'Rua Teste, 123' // ❌ Causava erro
};
```

**Depois (sem address):**
```javascript
const userData = {
    name: 'Teste',
    email: 'teste@exemplo.com',
    password: '123456',
    phone: '(11) 99999-9999'
    // Sem address - CORRIGIDO
};
```

## 🚀 Como Fazer o Deploy

### **Opção 1: Deploy Manual no Render (Recomendada)**

1. **Acesse o Render:**
   ```
   https://render.com/dashboard
   ```

2. **Vá para o projeto:**
   - Projeto: `docesensacoes-2`
   - Clique no projeto

3. **Faça deploy manual:**
   - Clique em **"Manual Deploy"**
   - Selecione **"Clear build cache & deploy"**
   - Aguarde 2-3 minutos

4. **Verifique os logs:**
   - Vá para a aba **"Logs"**
   - Procure por mensagens de sucesso

### **Opção 2: Deploy via Git (Se conectado)**

1. **Commit das alterações:**
   ```bash
   git add .
   git commit -m "Corrigir problema da coluna endereço"
   git push origin main
   ```

2. **Render fará deploy automático**

## 🧪 Como Testar Após o Deploy

### **1. Teste via Página HTML:**
```
http://localhost:8000/teste-correcao-endereco.html
```

### **2. Teste via Curl:**
```bash
# Testar cadastro sem endereço
curl -X POST https://docesensacoes-2.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@exemplo.com",
    "password": "123456",
    "phone": "(11) 99999-9999"
  }'
```

### **3. Teste via Site Principal:**
```
https://docesensacoes.vercel.app/src/pages/cadastro.html
```

## ✅ Resultado Esperado

Após o deploy:
- ✅ **Erro 500 resolvido**
- ✅ **Cadastro funcionando**
- ✅ **Sem campo address sendo enviado**
- ✅ **Sem campo address sendo processado**

## 🔍 Verificação de Logs

### **Logs de Sucesso Esperados:**
```
✅ Conectado ao banco de dados PostgreSQL
✅ Servidor rodando na porta 3000
✅ Usuário cadastrado com sucesso
```

### **Se ainda houver erro 500:**
1. Verifique se o deploy foi concluído
2. Aguarde mais 2-3 minutos
3. Teste novamente
4. Verifique logs do Render

## 🎯 Próximos Passos

1. **Faça deploy manual no Render**
2. **Aguarde 2-3 minutos**
3. **Teste o cadastro**
4. **Verifique se o erro 500 foi resolvido**

## 💡 Dica

O problema era que o código tentava inserir na coluna `address` que não existe. Agora o código:
- ✅ **Não envia** o campo `address` do frontend
- ✅ **Não processa** o campo `address` no backend
- ✅ **Não insere** o campo `address` no banco

**Faça o deploy manual no Render para aplicar as correções!** 🚀 