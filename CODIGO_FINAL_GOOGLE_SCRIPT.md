# 🚨 CÓDIGO FINAL - Google Apps Script

## ❌ PROBLEMA ATUAL
A API ainda está retornando: `TypeError: output.addHeader is not a function`

## ✅ SOLUÇÃO DEFINITIVA
Copie **EXATAMENTE** este código para o Google Apps Script:

```javascript
// ID da planilha
const SPREADSHEET_ID = '1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso';

// Função principal GET
function doGet(e) {
  return handleRequest(e);
}

// Função principal POST
function doPost(e) {
  return handleRequest(e);
}

// Função principal OPTIONS
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Função para tratar requisições
function handleRequest(e) {
  try {
    let action = null;
    
    if (e.parameter && e.parameter.action) {
      action = e.parameter.action;
    } else if (e.postData && e.postData.contents) {
      const postData = JSON.parse(e.postData.contents);
      action = postData.action;
    }
    
    if (!action) {
      return createResponse(400, { error: 'Ação não especificada' });
    }
    
    switch (action) {
      case 'getProdutos':
        return getProdutos();
      case 'getProduto':
        const produtoId = e.parameter ? e.parameter.id : null;
        return getProduto(produtoId);
      default:
        return createResponse(400, { error: 'Ação não reconhecida: ' + action });
    }
  } catch (error) {
    return createResponse(500, { error: 'Erro interno: ' + error.toString() });
  }
}

// Função para buscar produtos
function getProdutos() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Produtos');
    
    if (!sheet) {
      return createResponse(404, { error: 'Aba Produtos não encontrada' });
    }
    
    const data = sheet.getDataRange().getValues();
    const produtos = [];
    
    // Pular cabeçalho (primeira linha)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Verificar se produto está ativo (coluna 6)
      if (row[6] === true || row[6] === 'TRUE' || row[6] === 1) {
        produtos.push({
          id: row[0],
          nome: row[1],
          descricao: row[2],
          preco: row[3],
          categoria: row[4],
          imagem: row[5],
          ativo: row[6]
        });
      }
    }
    
    return createResponse(200, { produtos: produtos });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar produtos: ' + error.toString() });
  }
}

// Função para buscar produto específico
function getProduto(id) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Produtos');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id && (data[i][6] === true || data[i][6] === 'TRUE' || data[i][6] === 1)) {
        return createResponse(200, {
          produto: {
            id: data[i][0],
            nome: data[i][1],
            descricao: data[i][2],
            preco: data[i][3],
            categoria: data[i][4],
            imagem: data[i][5],
            ativo: data[i][6]
          }
        });
      }
    }
    
    return createResponse(404, { error: 'Produto não encontrado' });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar produto: ' + error.toString() });
  }
}

// Função para criar resposta - VERSÃO ULTRA-SIMPLES
function createResponse(statusCode, data) {
  const response = {
    status: statusCode,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 📋 PASSOS PARA APLICAR

### 1. Acessar Google Apps Script
1. Vá para: https://script.google.com/
2. Faça login com sua conta Google
3. Abra o projeto: `AKfycbw2o3d6ytgBi91T6A8P8mhlUz_4c8hkxCEcbRrvTEWvSCtVswbJKmn8T6ydGC-Nz3LN`

### 2. Substituir Código
1. Abra o arquivo `Code.gs`
2. **Selecione TODO** (Ctrl+A)
3. **Delete TUDO**
4. **Cole o código acima**
5. **Salve** (Ctrl+S)

### 3. Testar
1. Abra: `http://localhost:8000/diagnostico-planilha.html`
2. Clique em "Testar API"
3. Verifique se retorna JSON válido

## 🎯 ESTRUTURA DA PLANILHA

A planilha deve ter uma aba chamada **"Produtos"** com esta estrutura:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | Nome | Descrição | Preço | Categoria | Imagem | Ativo |
| 1 | Brigadeiro | Delicioso brigadeiro | 5.50 | Docinhos | dish.png | TRUE |
| 2 | Cupcake | Cupcake de chocolate | 8.00 | Cupcakes | dish2.png | TRUE |

## 🚨 IMPORTANTE

- **NÃO** deixe nenhum código antigo
- **COPIE EXATAMENTE** o código acima
- **SALVE** após colar
- **TESTE** antes de continuar

## ✅ RESULTADO ESPERADO

Após aplicar, a API deve retornar:
```json
{
  "status": 200,
  "data": {
    "produtos": [
      {
        "id": "1",
        "nome": "Brigadeiro",
        "descricao": "Delicioso brigadeiro",
        "preco": 5.50,
        "categoria": "Docinhos",
        "imagem": "dish.png",
        "ativo": true
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

**Este código é ULTRA-SIMPLIFICADO e deve funcionar sem erros!** 🎯 