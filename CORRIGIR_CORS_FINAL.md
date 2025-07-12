# 🚨 URGENTE: Corrigir Erro de CORS - Versão Final

## ❌ **Problema Atual**
Erro de CORS: `No 'Access-Control-Allow-Origin' header is present`

## ✅ **Solução Definitiva**

### **1. Atualizar Google Apps Script**

**Cole este código EXATO** no Google Apps Script:

```javascript
// ID da planilha - SUBSTITUA PELO ID DA SUA PLANILHA
const SPREADSHEET_ID = 'COLE_AQUI_O_ID_DA_SUA_PLANILHA';

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
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization')
    .setHeader('Access-Control-Max-Age', '86400');
}

// Função para tratar requisições
function handleRequest(e) {
  try {
    let action = null;
    let postData = null;
    
    if (e.parameter && e.parameter.action) {
      action = e.parameter.action;
    } else if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
      action = postData.action;
    }
    
    if (!action) {
      return createResponse(400, { error: 'Ação não especificada' });
    }
    
    switch (action) {
      case 'teste':
        return createResponse(200, { message: 'Conexão OK' });
      
      // Produtos
      case 'getProdutos':
        return getProdutos();
      
      // Usuários
      case 'createUsuario':
        return createUsuario(postData.usuario);
      case 'loginUsuario':
        return loginUsuario(postData.credentials);
      
      default:
        return createResponse(400, { error: 'Ação não reconhecida: ' + action });
    }
  } catch (error) {
    console.error('Erro na API:', error);
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

// Função para criar usuário
function createUsuario(usuario) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Usuarios');
    
    if (!sheet) {
      // Criar aba se não existir
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = spreadsheet.insertSheet('Usuarios');
      
      // Adicionar cabeçalhos
      newSheet.getRange(1, 1, 1, 8).setValues([
        ['ID', 'Nome', 'Email', 'Telefone', 'Endereco', 'Senha', 'Data Cadastro', 'Ativo']
      ]);
      
      // Formatar cabeçalhos
      newSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#f0f0f0');
      
      return createUsuario(usuario); // Tentar novamente
    }
    
    // Validar dados obrigatórios
    if (!usuario.nome || !usuario.email || !usuario.senha) {
      return createResponse(400, { error: 'Nome, email e senha são obrigatórios' });
    }
    
    // Verificar se email já existe
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === usuario.email) {
        return createResponse(400, { error: 'Email já cadastrado' });
      }
    }
    
    // Preparar dados para inserção
    const rowData = [
      usuario.id || Math.floor(Math.random() * 9000) + 1000,
      usuario.nome,
      usuario.email,
      usuario.telefone || '',
      usuario.endereco || '',
      usuario.senha,
      usuario.dataCadastro || new Date().toISOString(),
      true
    ];
    
    // Inserir na planilha
    sheet.appendRow(rowData);
    
    return createResponse(200, { 
      message: 'Usuário cadastrado com sucesso',
      usuario: {
        id: rowData[0],
        nome: rowData[1],
        email: rowData[2],
        telefone: rowData[3],
        endereco: rowData[4],
        dataCadastro: rowData[6]
      }
    });
    
  } catch (error) {
    return createResponse(500, { error: 'Erro ao cadastrar usuário: ' + error.toString() });
  }
}

// Função para login de usuário
function loginUsuario(credentials) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Usuarios');
    
    if (!sheet) {
      return createResponse(404, { error: 'Aba Usuarios não encontrada' });
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Buscar usuário por email e senha
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[2] === credentials.email && row[5] === credentials.senha && row[7] === true) {
        return createResponse(200, {
          message: 'Login realizado com sucesso',
          usuario: {
            id: row[0],
            nome: row[1],
            email: row[2],
            telefone: row[3],
            endereco: row[4],
            dataCadastro: row[6]
          }
        });
      }
    }
    
    return createResponse(401, { error: 'Email ou senha incorretos' });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao fazer login: ' + error.toString() });
  }
}

// Função para criar resposta com headers CORS
function createResponse(statusCode, data) {
  const response = {
    status: statusCode,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization')
    .setHeader('Access-Control-Max-Age', '86400');
}
```

### **2. IMPORTANTE: Substituir ID da Planilha**
Na linha 2, substitua:
```javascript
const SPREADSHEET_ID = 'COLE_AQUI_O_ID_DA_SUA_PLANILHA';
```
Pelo ID da sua planilha.

### **3. Salvar e Re-publicar**
1. **Salve** (Ctrl+S)
2. **Deploy** > "Manage deployments"
3. **Editar** deployment atual
4. **New version** > **Deploy**

### **4. Testar**
1. **Abra** `src/pages/login.html` no navegador
2. **Tente** fazer login
3. **Verifique** se não há mais erros de CORS

---

**⏰ Tempo estimado: 5 minutos**
**🎯 Resultado: CORS corrigido e autenticação funcionando** 