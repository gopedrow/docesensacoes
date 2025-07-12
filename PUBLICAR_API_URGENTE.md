# 🚨 URGENTE: Publicar Google Apps Script para Autenticação Funcionar

## ⚠️ **PROBLEMA ATUAL**
A autenticação (login/cadastro) não está funcionando porque o Google Apps Script não foi publicado corretamente.

## 🎯 **SOLUÇÃO RÁPIDA (15 minutos)**

### **Passo 1: Criar a Planilha (5 min)**

1. **Acesse:** https://sheets.google.com
2. **Crie uma nova planilha**
3. **Renomeie para:** "Doce Sensações - Base de Dados"
4. **Copie o ID da URL:** `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`
5. **Crie as abas:**
   - `Produtos`
   - `Usuarios` 
   - `Pedidos`
   - `Avaliacoes`

### **Passo 2: Configurar Google Apps Script (5 min)**

1. **Acesse:** https://script.google.com
2. **Clique:** "Novo projeto"
3. **Renomeie para:** "Doce Sensações API"
4. **Substitua todo o código** pelo conteúdo do arquivo `google-apps-script/Code.gs`
5. **IMPORTANTE:** Na linha 1, substitua:
   ```javascript
   const SPREADSHEET_ID = 'SEU_ID_AQUI'; // Coloque o ID da sua planilha
   ```
6. **Salve** (Ctrl+S)

### **Passo 3: Publicar como Web App (5 min)**

1. **Clique:** "Deploy" > "New deployment"
2. **Selecione:** "Web app"
3. **Configure:**
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
4. **Clique:** "Deploy"
5. **COPIE a URL** gerada (algo como: `https://script.google.com/macros/s/AKfycbz.../exec`)

### **Passo 4: Atualizar o Frontend**

1. **Abra:** `src/javascript/config.js`
2. **Substitua a linha 4:**
   ```javascript
   BASE_URL: 'SUA_URL_AQUI', // Cole a URL do Google Apps Script
   ```
3. **Salve o arquivo**

## 🧪 **Teste Rápido**

### **Teste 1: Verificar se a API está funcionando**
Abra no navegador:
```
SUA_URL_AQUI?action=getProdutos
```

### **Teste 2: Testar login**
1. Abra `src/pages/login.html`
2. Tente fazer login com qualquer email/senha
3. Verifique se não há erros no console (F12)

## 🔧 **Se der erro de CORS**

Adicione esta função no final do `Code.gs`:

```javascript
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
```

## 📞 **Precisa de ajuda?**

Se encontrar problemas:
1. Verifique se a planilha foi criada corretamente
2. Verifique se o ID da planilha está correto
3. Verifique se o Google Apps Script foi publicado
4. Teste a URL da API diretamente no navegador

## ✅ **Resultado esperado**

Após seguir estes passos:
- ✅ Login funcionará
- ✅ Cadastro funcionará  
- ✅ Produtos carregarão
- ✅ Carrinho funcionará
- ✅ Pedidos funcionarão

---

**⏰ Tempo estimado: 15 minutos**
**🎯 Resultado: Autenticação 100% funcional** 