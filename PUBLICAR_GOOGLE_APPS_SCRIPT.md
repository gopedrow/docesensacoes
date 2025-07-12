# 🚀 Publicar Google Apps Script - Doce Sensações

## 🎯 **Objetivo**
Publicar o Google Apps Script como Web App para que a autenticação funcione.

## 📋 **Passo a Passo**

### **1. Atualizar o Código no Google Apps Script**

1. **Abra** seu projeto no Google Apps Script
2. **Substitua** todo o código pelo conteúdo atualizado do arquivo `google-apps-script/Code.gs`
3. **IMPORTANTE:** Na linha 2, substitua o ID da planilha:
   ```javascript
   const SPREADSHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI';
   ```
4. **Salve** (Ctrl+S)

### **2. Configurar Permissões**

1. **Clique** em "Executar" > "Executar função" > "doGet"
2. **Clique** em "Revisar permissões"
3. **Selecione** sua conta Google
4. **Clique** em "Avançado" > "Ir para [Nome do Projeto] (não seguro)"
5. **Clique** em "Permitir"

### **3. Publicar como Web App**

1. **Clique** em "Deploy" > "New deployment"
2. **Selecione** "Web app"
3. **Configure:**
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
4. **Clique** em "Deploy"
5. **COPIE** a URL gerada (algo como: `https://script.google.com/macros/s/AKfycbz.../exec`)

### **4. Testar a API**

Teste se a API está funcionando:

#### **Teste 1: Conexão básica**
Abra no navegador:
```
SUA_URL_AQUI?action=teste
```

**Resposta esperada:**
```json
{
  "status": 200,
  "data": {
    "message": "Conexão OK"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### **Teste 2: Buscar produtos**
```
SUA_URL_AQUI?action=getProdutos
```

**Resposta esperada:**
```json
{
  "status": 200,
  "data": {
    "produtos": [
      {
        "id": "1",
        "nome": "Brigadeiro Gourmet",
        "descricao": "Brigadeiro tradicional com chocolate belga premium",
        "preco": "5.50",
        "categoria": "Docinhos",
        "imagem": "dish.png",
        "ativo": true
      }
    ]
  }
}
```

### **5. Atualizar o Frontend**

1. **Abra** o arquivo `src/javascript/config.js`
2. **Substitua** a linha 4:
   ```javascript
   BASE_URL: 'SUA_URL_AQUI', // Cole a URL do Google Apps Script
   ```
3. **Salve** o arquivo

### **6. Testar o Site**

1. **Abra** `src/pages/login.html` no navegador
2. **Tente** fazer login com qualquer email/senha
3. **Verifique** se não há erros no console (F12)

## 🔧 **Troubleshooting**

### **Erro: "CORS"**
- Verifique se a função `doOptions` está configurada corretamente
- Verifique se os headers CORS estão incluídos

### **Erro: "Spreadsheet not found"**
- Verifique se o ID da planilha está correto
- Verifique se a planilha está compartilhada

### **Erro: "Permission denied"**
- Execute novamente o processo de autorização
- Verifique se a planilha está compartilhada

### **Erro: "API não encontrada"**
- Verifique se a URL está correta
- Verifique se o Google Apps Script está publicado

## ✅ **Verificação Final**

Após publicar, verifique se:
- [ ] API responde ao teste básico
- [ ] Produtos carregam no site
- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Não há erros de CORS

## 🎯 **Próximo Passo**

Após publicar com sucesso:
1. **Atualize** a URL no `config.js`
2. **Faça commit** das mudanças
3. **Teste** todas as funcionalidades
4. **Publique** no GitHub Pages

---

**⏰ Tempo estimado: 15 minutos**
**🎯 Resultado: API funcionando e autenticação ativa** 