# 🚀 DEPLOY FORÇADO NO RENDER - RESOLVER ERRO COLUNA "endereço"

## ⚠️ PROBLEMA ATUAL
O Render ainda está usando código em cache com o campo "address", causando erro:
```
erro: coluna "endereço" da relação "usuários" não existe
```

## 🔧 SOLUÇÃO DEFINITIVA

### **PASSO 1: Deploy Manual Forçado**
1. Acesse: https://render.com/dashboard
2. Vá para o projeto: `docesensacoes-2`
3. Clique em **"Manual Deploy"**
4. **IMPORTANTE:** Selecione **"Clear build cache & deploy"**
5. Aguarde o deploy completar (2-3 minutos)

### **PASSO 2: Verificar Logs**
Após o deploy, verifique os logs:
- Vá para a aba **"Logs"**
- Procure por: `🔧 CORREÇÃO: Removido campo 'address'`
- Confirme que não há mais erros de "endereço"

### **PASSO 3: Testar API**
```bash
# Testar cadastro sem endereço
curl -X POST https://docesensacoes-2.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@teste.com","password":"123456","phone":"(11) 99999-9999"}'
```

## 🧪 TESTE RÁPIDO

### **Opção 1: Página de Teste**
1. Acesse: `http://localhost:8000/teste-correcao-endereco.html`
2. Clique em **"Testar Sem Endereço"**
3. Deve funcionar sem erros

### **Opção 2: Site Oficial**
1. Acesse: `https://docesensacoes.vercel.app/src/pages/cadastro.html`
2. Tente criar uma conta
3. Deve funcionar perfeitamente

## 🔍 VERIFICAÇÃO FINAL

### **Se ainda houver erro:**
1. **Forçar reinicialização do banco:**
   ```bash
   curl -X POST https://docesensacoes-2.onrender.com/api/init-database
   ```

2. **Verificar estrutura da tabela:**
   - O banco deve usar tabela `users` (não `usuários`)
   - Colunas: `id`, `name`, `email`, `password`, `phone`, `is_admin`, `active`, `created_at`

3. **Limpar cache do navegador:**
   - Ctrl+F5 ou Cmd+Shift+R
   - Ou abrir em aba anônima

## ✅ RESULTADO ESPERADO

Após o deploy forçado:
- ✅ Cadastro funcionando sem campo endereço
- ✅ Login funcionando
- ✅ Sistema completo operacional
- ✅ Sem erros de coluna "endereço"

## 🆘 SE O PROBLEMA PERSISTIR

### **Solução Nuclear:**
1. **Deletar e recriar o serviço no Render**
2. **Fazer novo deploy do zero**
3. **Inicializar banco novamente**

### **Verificar Código:**
- O arquivo `routes/auth.js` deve estar sem o campo `address` na query INSERT
- O frontend não deve enviar o campo `address`

## 🎯 COMANDOS DE VERIFICAÇÃO

```bash
# Testar API
curl https://docesensacoes-2.onrender.com/api/test

# Testar cadastro
curl -X POST https://docesensacoes-2.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@teste.com","password":"123456","phone":"(11) 99999-9999"}'

# Testar login
curl -X POST https://docesensacoes-2.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@docesensacoes.com","password":"admin123"}'
```

**🚀 EXECUTE O DEPLOY MANUAL COM "CLEAR CACHE" AGORA!** 