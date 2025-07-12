// Configurações da planilha
const SPREADSHEET_ID = '1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso';

// Função principal para lidar com requisições
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    let action = null;
    
    // Verificar se é uma requisição GET ou POST
    if (e.parameter && e.parameter.action) {
      action = e.parameter.action;
    } else if (e.postData && e.postData.contents) {
      const postData = JSON.parse(e.postData.contents);
      action = postData.action;
    }
    
    if (!action) {
      return createResponse(400, { error: 'Ação não especificada' });
    }
    
    console.log('Ação solicitada:', action);
    
    switch (action) {
      case 'getProdutos':
        return getProdutos();
      case 'getProduto':
        const produtoId = e.parameter ? e.parameter.id : (e.postData && e.postData.contents ? JSON.parse(e.postData.contents).id : null);
        return getProduto(produtoId);
      case 'createUsuario':
        return createUsuario(JSON.parse(e.postData.contents));
      case 'loginUsuario':
        return loginUsuario(JSON.parse(e.postData.contents));
      case 'createPedido':
        return createPedido(JSON.parse(e.postData.contents));
      case 'getPedidos':
        const usuarioId = e.parameter ? e.parameter.usuarioId : (e.postData && e.postData.contents ? JSON.parse(e.postData.contents).usuarioId : null);
        return getPedidos(usuarioId);
      case 'createAvaliacao':
        return createAvaliacao(JSON.parse(e.postData.contents));
      case 'getAvaliacoes':
        const avaliacaoProdutoId = e.parameter ? e.parameter.produtoId : (e.postData && e.postData.contents ? JSON.parse(e.postData.contents).produtoId : null);
        return getAvaliacoes(avaliacaoProdutoId);
      default:
        return createResponse(400, { error: 'Ação não reconhecida: ' + action });
    }
  } catch (error) {
    console.error('Erro no handleRequest:', error);
    return createResponse(500, { error: 'Erro interno do servidor: ' + error.toString() });
  }
}

// Função para obter todos os produtos
function getProdutos() {
  try {
    console.log('Iniciando busca de produtos...');
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Produtos');
    
    if (!sheet) {
      console.error('Aba "Produtos" não encontrada');
      return createResponse(404, { error: 'Aba "Produtos" não encontrada na planilha' });
    }
    
    const data = sheet.getDataRange().getValues();
    console.log('Dados brutos da planilha:', data);
    
    const produtos = [];
    
    // Pular a primeira linha (cabeçalhos)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      console.log('Processando linha:', row);
      
      // Verificar se o produto está ativo (coluna 6, índice 6)
      if (row[6] === true || row[6] === 'TRUE' || row[6] === 1) {
        const produto = {
          id: row[0],
          nome: row[1],
          descricao: row[2],
          preco: row[3],
          categoria: row[4],
          imagem: row[5],
          ativo: row[6]
        };
        produtos.push(produto);
        console.log('Produto adicionado:', produto);
      }
    }
    
    console.log('Total de produtos encontrados:', produtos.length);
    return createResponse(200, { produtos: produtos });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return createResponse(500, { error: 'Erro ao buscar produtos: ' + error.toString() });
  }
}

// Função para obter um produto específico
function getProduto(id) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Produtos');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id && (data[i][6] === true || data[i][6] === 'TRUE' || data[i][6] === 1)) {
        const produto = {
          id: data[i][0],
          nome: data[i][1],
          descricao: data[i][2],
          preco: data[i][3],
          categoria: data[i][4],
          imagem: data[i][5],
          ativo: data[i][6]
        };
        return createResponse(200, { produto: produto });
      }
    }
    
    return createResponse(404, { error: 'Produto não encontrado' });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar produto: ' + error.toString() });
  }
}

// Função para criar novo usuário
function createUsuario(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Usuarios');
    
    // Verificar se email já existe
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
        id: id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        dataCadastro: dataCadastro
      }
    });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao criar usuário: ' + error.toString() });
  }
}

// Função para login de usuário
function loginUsuario(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Usuarios');
    const sheetData = sheet.getDataRange().getValues();
    
    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][2] === data.email) {
        const usuario = {
          id: sheetData[i][0],
          nome: sheetData[i][1],
          email: sheetData[i][2],
          telefone: sheetData[i][3],
          endereco: sheetData[i][4],
          dataCadastro: sheetData[i][5]
        };
        return createResponse(200, { usuario: usuario });
      }
    }
    
    return createResponse(401, { error: 'Email não encontrado' });
  } catch (error) {
    return createResponse(500, { error: 'Erro no login: ' + error.toString() });
  }
}

// Função para criar novo pedido
function createPedido(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Pedidos');
    
    const id = Date.now().toString();
    const dataPedido = new Date().toISOString();
    
    const newRow = [
      id,
      data.usuarioId,
      JSON.stringify(data.produtos),
      data.total,
      'Pendente',
      dataPedido
    ];
    
    sheet.appendRow(newRow);
    
    return createResponse(201, { 
      message: 'Pedido criado com sucesso',
      pedido: {
        id: id,
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

// Função para obter pedidos de um usuário
function getPedidos(usuarioId) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Pedidos');
    const data = sheet.getDataRange().getValues();
    const pedidos = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] == usuarioId) {
        const pedido = {
          id: data[i][0],
          usuarioId: data[i][1],
          produtos: JSON.parse(data[i][2]),
          total: data[i][3],
          status: data[i][4],
          data: data[i][5]
        };
        pedidos.push(pedido);
      }
    }
    
    return createResponse(200, { pedidos: pedidos });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar pedidos: ' + error.toString() });
  }
}

// Função para criar nova avaliação
function createAvaliacao(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Avaliacoes');
    
    const id = Date.now().toString();
    const dataAvaliacao = new Date().toISOString();
    
    const newRow = [
      id,
      data.produtoId,
      data.usuarioId,
      data.nota,
      data.comentario,
      dataAvaliacao
    ];
    
    sheet.appendRow(newRow);
    
    return createResponse(201, { 
      message: 'Avaliação criada com sucesso',
      avaliacao: {
        id: id,
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

// Função para obter avaliações de um produto
function getAvaliacoes(produtoId) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Avaliacoes');
    const data = sheet.getDataRange().getValues();
    const avaliacoes = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] == produtoId) {
        const avaliacao = {
          id: data[i][0],
          produtoId: data[i][1],
          usuarioId: data[i][2],
          nota: data[i][3],
          comentario: data[i][4],
          data: data[i][5]
        };
        avaliacoes.push(avaliacao);
      }
    }
    
    return createResponse(200, { avaliacoes: avaliacoes });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar avaliações: ' + error.toString() });
  }
}

// Função para criar resposta HTTP - VERSÃO SIMPLIFICADA
function createResponse(statusCode, data) {
  const response = {
    statusCode: statusCode,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  // VERSÃO ULTRA-SIMPLES - Sem headers CORS
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Função para lidar com requisições OPTIONS - VERSÃO SIMPLIFICADA
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
} 