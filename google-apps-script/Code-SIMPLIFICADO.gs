// ID da planilha
const SPREADSHEET_ID = '1WrEnjgZKOITTiYLXyahTRUQ8RuYTXD5qxUwDjXFysQc';

// Função principal GET
function doGet(e) {
  return handleRequest(e);
}

// Função principal POST
function doPost(e) {
  return handleRequest(e);
}

// Função para tratar requisições
function handleRequest(e) {
  try {
    let action = null;
    let postData = null;
    
    // Pegar ação dos parâmetros GET
    if (e.parameter && e.parameter.action) {
      action = e.parameter.action;
    }
    
    // Pegar ação do corpo POST
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
        action = postData.action;
      } catch (error) {
        // Ignora erro de parsing
      }
    }
    
    if (!action) {
      return createResponse(400, { error: 'Ação não especificada' });
    }
    
    switch (action) {
      case 'teste':
        return createResponse(200, { message: 'Conexão OK' });
      
      case 'getProdutos':
        return getProdutos();
      
      case 'getUsuarios':
        return getUsuarios();
      
      case 'login':
        return login(postData);
      
      case 'cadastrarUsuario':
        return cadastrarUsuario(postData);
      
      case 'cadastrarProduto':
        return cadastrarProduto(postData);
      
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

// Função para buscar usuários
function getUsuarios() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Usuarios');
    
    if (!sheet) {
      return createResponse(404, { error: 'Aba Usuarios não encontrada' });
    }
    
    const data = sheet.getDataRange().getValues();
    const usuarios = [];
    
    // Pular cabeçalho (primeira linha)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Verificar se usuário está ativo (coluna 7)
      if (row[7] === true || row[7] === 'TRUE' || row[7] === 1) {
        usuarios.push({
          id: row[0],
          nome: row[1],
          email: row[2],
          telefone: row[3],
          endereco: row[4],
          dataCadastro: row[6]
        });
      }
    }
    
    return createResponse(200, { usuarios: usuarios });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar usuários: ' + error.toString() });
  }
}

// Função para login
function login(loginData) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Usuarios');
    
    if (!sheet) {
      return createResponse(404, { error: 'Aba Usuarios não encontrada' });
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Buscar usuário por email e telefone
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[2] === loginData.email && row[3] === loginData.telefone && row[7] === true) {
        return createResponse(200, {
          message: 'Login realizado com sucesso',
          data: {
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
    
    return createResponse(401, { error: 'Email ou telefone incorretos' });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao fazer login: ' + error.toString() });
  }
}

// Função para cadastrar usuário
function cadastrarUsuario(postData) {
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
      
      return cadastrarUsuario(postData); // Tentar novamente
    }
    
    const usuario = postData.usuario;
    
    // Validar dados obrigatórios
    if (!usuario.nome || !usuario.email || !usuario.telefone) {
      return createResponse(400, { error: 'Nome, email e telefone são obrigatórios' });
    }
    
    // Preparar dados para inserção
    const rowData = [
      usuario.id || Math.floor(Math.random() * 9000) + 1000,
      usuario.nome,
      usuario.email,
      usuario.telefone,
      usuario.endereco || '',
      usuario.senha || '123456',
      usuario.dataCadastro || new Date().toISOString(),
      true
    ];
    
    // Inserir na planilha
    sheet.appendRow(rowData);
    
    return createResponse(200, { 
      message: 'Usuário cadastrado com sucesso',
      data: {
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

// Função para cadastrar produto
function cadastrarProduto(postData) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Produtos');
    
    if (!sheet) {
      // Criar aba se não existir
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = spreadsheet.insertSheet('Produtos');
      
      // Adicionar cabeçalhos
      newSheet.getRange(1, 1, 1, 8).setValues([
        ['ID', 'Nome', 'Descrição', 'Preço', 'Categoria', 'Imagem', 'Ativo', 'Data Cadastro']
      ]);
      
      return cadastrarProduto(postData); // Tentar novamente
    }
    
    const produto = postData.produto;
    
    // Validar dados obrigatórios
    if (!produto.nome || !produto.descricao || !produto.preco || !produto.categoria) {
      return createResponse(400, { error: 'Dados obrigatórios não fornecidos' });
    }
    
    // Preparar dados para inserção
    const rowData = [
      produto.id || Math.floor(Math.random() * 9000) + 1000,
      produto.nome,
      produto.descricao,
      produto.preco,
      produto.categoria,
      produto.imagem || '',
      true,
      produto.dataCadastro || new Date().toISOString()
    ];
    
    // Inserir na planilha
    sheet.appendRow(rowData);
    
    return createResponse(200, { 
      message: 'Produto cadastrado com sucesso',
      data: {
        id: rowData[0],
        nome: rowData[1],
        descricao: rowData[2],
        preco: rowData[3],
        categoria: rowData[4],
        imagem: rowData[5],
        ativo: rowData[6]
      }
    });
    
  } catch (error) {
    return createResponse(500, { error: 'Erro ao cadastrar produto: ' + error.toString() });
  }
}

// Função para criar resposta
function createResponse(statusCode, data) {
  const response = {
    status: statusCode,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
} 