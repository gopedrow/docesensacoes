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
      case 'cadastrarProduto':
        return cadastrarProduto(postData.produto);
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

// Função para cadastrar produto
function cadastrarProduto(produto) {
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
      
      // Formatar cabeçalhos
      newSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#f0f0f0');
      
      return cadastrarProduto(produto); // Tentar novamente
    }
    
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
      produto.status === 'ativo' ? true : false,
      produto.dataCadastro || new Date().toISOString()
    ];
    
    // Inserir na planilha
    sheet.appendRow(rowData);
    
    return createResponse(200, { 
      message: 'Produto cadastrado com sucesso',
      produto: {
        id: rowData[0],
        nome: rowData[1],
        descricao: rowData[2],
        preco: rowData[3],
        categoria: rowData[4],
        imagem: rowData[5],
        ativo: rowData[6],
        dataCadastro: rowData[7]
      }
    });
    
  } catch (error) {
    return createResponse(500, { error: 'Erro ao cadastrar produto: ' + error.toString() });
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