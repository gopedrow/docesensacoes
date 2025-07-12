# 🚨 URGENTE: Copiar Código para Google Apps Script

## ❌ Problema Atual
A API ainda está retornando erro: `TypeError: output.addHeader is not a function`

## ✅ Solução
Você precisa copiar o código corrigido do arquivo `google-apps-script/Code.gs` para o Google Apps Script.

## 📋 PASSOS DETALHADOS

### 1. Abrir o Google Apps Script
1. Vá para: https://script.google.com/
2. Faça login com sua conta Google
3. Procure pelo projeto: `AKfycbw2o3d6ytgBi91T6A8P8mhlUz_4c8hkxCEcbRrvTEWvSCtVswbJKmn8T6ydGC-Nz3LN`

### 2. Abrir o Arquivo Code.gs
1. Clique no arquivo `Code.gs` no painel esquerdo
2. Você verá o código atual que está causando erro

### 3. Substituir Todo o Código
1. **Selecione TODO o conteúdo** (Ctrl+A ou Cmd+A)
2. **Delete tudo** (Delete ou Backspace)
3. **Cole o código corrigido** (Ctrl+V ou Cmd+V)

### 4. Código para Copiar
Copie **TODO** o conteúdo do arquivo `google-apps-script/Code.gs`:

```javascript
// ID da sua planilha
const SPREADSHEET_ID = '1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso';

// Funções de entrada
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .appendHeader("Access-Control-Allow-Origin", "*")
    .appendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .appendHeader("Access-Control-Allow-Headers", "Content-Type");
}

// Função principal para tratar as ações
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
        const produtoId = e.parameter?.id || JSON.parse(e.postData?.contents || '{}').id;
        return getProduto(produtoId);
      case 'createUsuario':
        return createUsuario(JSON.parse(e.postData.contents));
      case 'loginUsuario':
        return loginUsuario(JSON.parse(e.postData.contents));
      case 'createPedido':
        return createPedido(JSON.parse(e.postData.contents));
      case 'getPedidos':
        const usuarioId = e.parameter?.usuarioId || JSON.parse(e.postData?.contents || '{}').usuarioId;
        return getPedidos(usuarioId);
      case 'createAvaliacao':
        return createAvaliacao(JSON.parse(e.postData.contents));
      case 'getAvaliacoes':
        const produtoIdAval = e.parameter?.produtoId || JSON.parse(e.postData?.contents || '{}').produtoId;
        return getAvaliacoes(produtoIdAval);
      default:
        return createResponse(400, { error: 'Ação não reconhecida: ' + action });
    }
  } catch (error) {
    return createResponse(500, { error: 'Erro interno: ' + error.toString() });
  }
}

// ---------------------- FUNÇÕES DE NEGÓCIO ----------------------

function getProdutos() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Produtos');
    if (!sheet) return createResponse(404, { error: 'Aba Produtos não encontrada' });

    const data = sheet.getDataRange().getValues();
    const produtos = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
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

    return createResponse(200, { produtos });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar produtos: ' + error.toString() });
  }
}

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

function createUsuario(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Usuarios');
    const existingData = sheet.getDataRange().getValues();

    for (let i = 1; i < existingData.length; i++) {
      if (existingData[i][2] === data.email) {
        return createResponse(400, { error: 'Email já cadastrado' });
      }
    }

    const id = Date.now().toString();
    const dataCadastro = new Date().toISOString();

    const newRow = [
      id,
      data.nome,
      data.email,
      data.telefone,
      data.endereco,
      dataCadastro
    ];

    sheet.appendRow(newRow);

    return createResponse(201, {
      message: 'Usuário criado com sucesso',
      usuario: {
        id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        dataCadastro
      }
    });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao criar usuário: ' + error.toString() });
  }
}

function loginUsuario(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Usuarios');
    const dados = sheet.getDataRange().getValues();

    for (let i = 1; i < dados.length; i++) {
      if (dados[i][2] === data.email) {
        return createResponse(200, {
          usuario: {
            id: dados[i][0],
            nome: dados[i][1],
            email: dados[i][2],
            telefone: dados[i][3],
            endereco: dados[i][4],
            dataCadastro: dados[i][5]
          }
        });
      }
    }

    return createResponse(401, { error: 'Email não encontrado' });
  } catch (error) {
    return createResponse(500, { error: 'Erro no login: ' + error.toString() });
  }
}

function createPedido(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Pedidos');
    const id = Date.now().toString();
    const dataPedido = new Date().toISOString();

    sheet.appendRow([
      id,
      data.usuarioId,
      JSON.stringify(data.produtos),
      data.total,
      'Pendente',
      dataPedido
    ]);

    return createResponse(201, {
      message: 'Pedido criado com sucesso',
      pedido: {
        id,
        usuarioId: data.usuarioId,
        produtos: data.produtos,
        total: data.total,
        status: 'Pendente',
        data: dataPedido
      }
    });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao criar pedido: ' + error.toString() });
  }
}

function getPedidos(usuarioId) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Pedidos');
    const data = sheet.getDataRange().getValues();
    const pedidos = [];

    for (let i = 1; i < data.length; i++) {
      if (data[i][1] == usuarioId) {
        pedidos.push({
          id: data[i][0],
          usuarioId: data[i][1],
          produtos: JSON.parse(data[i][2]),
          total: data[i][3],
          status: data[i][4],
          data: data[i][5]
        });
      }
    }

    return createResponse(200, { pedidos });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar pedidos: ' + error.toString() });
  }
}

function createAvaliacao(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Avaliacoes');
    const id = Date.now().toString();
    const dataAvaliacao = new Date().toISOString();

    sheet.appendRow([
      id,
      data.produtoId,
      data.usuarioId,
      data.nota,
      data.comentario,
      dataAvaliacao
    ]);

    return createResponse(201, {
      message: 'Avaliação criada com sucesso',
      avaliacao: {
        id,
        produtoId: data.produtoId,
        usuarioId: data.usuarioId,
        nota: data.nota,
        comentario: data.comentario,
        data: dataAvaliacao
      }
    });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao criar avaliação: ' + error.toString() });
  }
}

function getAvaliacoes(produtoId) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Avaliacoes');
    const data = sheet.getDataRange().getValues();
    const avaliacoes = [];

    for (let i = 1; i < data.length; i++) {
      if (data[i][1] == produtoId) {
        avaliacoes.push({
          id: data[i][0],
          produtoId: data[i][1],
          usuarioId: data[i][2],
          nota: data[i][3],
          comentario: data[i][4],
          data: data[i][5]
        });
      }
    }

    return createResponse(200, { avaliacoes });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar avaliações: ' + error.toString() });
  }
}

// Função de resposta com CORS e JSON
function createResponse(statusCode, data) {
  const resposta = {
    status: statusCode,
    data: data,
    timestamp: new Date().toISOString()
  };

  return ContentService.createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON)
    .appendHeader("Access-Control-Allow-Origin", "*")
    .appendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .appendHeader("Access-Control-Allow-Headers", "Content-Type");
}
```

### 5. Salvar o Código
1. Clique no **ícone de disquete** (Salvar) ou pressione Ctrl+S
2. Aguarde a confirmação de que foi salvo

### 6. Testar a API
1. Abra: `http://localhost:8000/teste-api-simples.html`
2. Clique em "Testar getProdutos"
3. Verifique se retorna JSON válido

## 🎯 Resultado Esperado
Após atualizar, a API deve retornar algo como:
```json
{
  "status": 200,
  "data": {
    "produtos": [
      {
        "id": "1",
        "nome": "Cupcake de Chocolate",
        "descricao": "Delicioso cupcake...",
        "preco": 8.50,
        "categoria": "Cupcakes",
        "imagem": "cupcake.jpg",
        "ativo": true
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🚨 IMPORTANTE
- **NÃO** deixe nenhum código antigo no Google Apps Script
- **COPIE TODO** o código fornecido acima
- **SALVE** após colar o código
- **TESTE** antes de continuar

---

**Após seguir estes passos, o erro "Failed to fetch" será resolvido!** 🎯 