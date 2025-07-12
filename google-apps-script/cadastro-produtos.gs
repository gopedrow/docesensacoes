// Google Apps Script para Cadastro de Produtos
// ID da planilha - SUBSTITUA PELO SEU ID
const SPREADSHEET_ID = '1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso';

// Função principal GET
function doGet(e) {
  return handleRequest(e);
}

// Função principal POST
function doPost(e) {
  return handleRequest(e);
}

// Função principal OPTIONS (para CORS)
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Função para tratar requisições
function handleRequest(e) {
  try {
    let action = null;
    let data = null;
    
    // Verificar se é GET ou POST
    if (e.parameter && e.parameter.action) {
      action = e.parameter.action;
    } else if (e.postData && e.postData.contents) {
      const postData = JSON.parse(e.postData.contents);
      action = postData.action;
      data = postData;
    }
    
    if (!action) {
      return createResponse(400, { error: 'Ação não especificada' });
    }
    
    switch (action) {
      case 'teste':
        return createResponse(200, { message: 'Conexão OK', timestamp: new Date().toISOString() });
        
      case 'configurarCabecalhos':
        return configurarCabecalhos();
        
      case 'cadastrarProduto':
        if (!data || !data.produto) {
          return createResponse(400, { error: 'Dados do produto não fornecidos' });
        }
        return cadastrarProduto(data.produto);
        
      case 'getProdutos':
        return getProdutos();
        
      case 'getProduto':
        const produtoId = e.parameter ? e.parameter.id : null;
        return getProduto(produtoId);
        
      default:
        return createResponse(400, { error: 'Ação não reconhecida: ' + action });
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return createResponse(500, { error: 'Erro interno: ' + error.toString() });
  }
}

// Função para cadastrar produto
function cadastrarProduto(produto) {
  try {
    console.log('Recebendo produto para cadastro:', produto);
    
    // Validar dados obrigatórios
    const erros = validarProduto(produto);
    if (erros.length > 0) {
      return createResponse(400, { error: 'Dados inválidos: ' + erros.join(', ') });
    }
    
    // Abrir planilha
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('Produtos');
    
    if (!sheet) {
      return createResponse(404, { error: 'Aba Produtos não encontrada' });
    }
    
    // Preparar dados para inserção
    const dadosLinha = [
      produto.id,                    // Coluna A - ID
      produto.nome,                  // Coluna B - Nome
      produto.descricao,             // Coluna C - Descrição
      produto.preco,                 // Coluna D - Preço
      produto.categoria,             // Coluna E - Categoria
      produto.imagem || '',          // Coluna F - Imagem (URL ou base64)
      produto.status === 'ativo',    // Coluna G - Ativo (boolean)
      produto.modalidade.join(', '), // Coluna H - Modalidades
      produto.desconto || 0,         // Coluna I - Desconto
      produto.dataCadastro,          // Coluna J - Data de Cadastro
      new Date().toISOString()       // Coluna K - Data de Atualização
    ];
    
    // Inserir na planilha
    sheet.appendRow(dadosLinha);
    
    // Obter o número da linha inserida
    const ultimaLinha = sheet.getLastRow();
    
    console.log('Produto cadastrado na linha:', ultimaLinha);
    
    return createResponse(200, {
      message: 'Produto cadastrado com sucesso',
      produtoId: produto.id,
      linha: ultimaLinha,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    return createResponse(500, { error: 'Erro ao cadastrar produto: ' + error.toString() });
  }
}

// Função para validar dados do produto
function validarProduto(produto) {
  const erros = [];
  
  if (!produto.id || produto.id <= 0) {
    erros.push('ID inválido');
  }
  
  if (!produto.nome || produto.nome.trim().length < 3) {
    erros.push('Nome deve ter pelo menos 3 caracteres');
  }
  
  if (!produto.descricao || produto.descricao.trim().length < 10) {
    erros.push('Descrição deve ter pelo menos 10 caracteres');
  }
  
  if (!produto.preco || produto.preco <= 0) {
    erros.push('Preço deve ser maior que zero');
  }
  
  if (!produto.categoria) {
    erros.push('Categoria é obrigatória');
  }
  
  if (!produto.modalidade || produto.modalidade.length === 0) {
    erros.push('Modalidade é obrigatória');
  }
  
  if (!produto.status || !['ativo', 'inativo', 'pendente'].includes(produto.status)) {
    erros.push('Status inválido');
  }
  
  if (produto.desconto && (produto.desconto < 0 || produto.desconto > 100)) {
    erros.push('Desconto deve estar entre 0 e 100');
  }
  
  return erros;
}

// Função para buscar produtos (mantida da versão anterior)
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
          ativo: row[6],
          modalidade: row[7] ? row[7].split(', ') : [],
          desconto: row[8] || 0,
          dataCadastro: row[9],
          dataAtualizacao: row[10]
        });
      }
    }
    
    return createResponse(200, { produtos: produtos });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar produtos: ' + error.toString() });
  }
}

// Função para buscar produto específico (mantida da versão anterior)
function getProduto(id) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Produtos');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id && (data[i][6] === true || data[i][6] === 'TRUE' || data[i][6] === 1)) {
        const row = data[i];
        return createResponse(200, {
          produto: {
            id: row[0],
            nome: row[1],
            descricao: row[2],
            preco: row[3],
            categoria: row[4],
            imagem: row[5],
            ativo: row[6],
            modalidade: row[7] ? row[7].split(', ') : [],
            desconto: row[8] || 0,
            dataCadastro: row[9],
            dataAtualizacao: row[10]
          }
        });
      }
    }
    
    return createResponse(404, { error: 'Produto não encontrado' });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar produto: ' + error.toString() });
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

// Função para configurar cabeçalhos da planilha
function configurarCabecalhos() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('Produtos');
    
    // Criar aba se não existir
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Produtos');
    }
    
    // Definir cabeçalhos
    const cabecalhos = [
      'ID',
      'Nome',
      'Descrição',
      'Preço',
      'Categoria',
      'Imagem',
      'Ativo',
      'Modalidades',
      'Desconto (%)',
      'Data Cadastro',
      'Data Atualização'
    ];
    
    // Limpar planilha e adicionar cabeçalhos
    sheet.clear();
    sheet.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);
    
    // Formatar cabeçalhos
    const headerRange = sheet.getRange(1, 1, 1, cabecalhos.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Ajustar largura das colunas
    sheet.autoResizeColumns(1, cabecalhos.length);
    
    console.log('Cabeçalhos configurados com sucesso!');
    
    return createResponse(200, { 
      message: 'Cabeçalhos configurados com sucesso',
      cabecalhos: cabecalhos,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao configurar cabeçalhos:', error);
    return createResponse(500, { error: 'Erro ao configurar cabeçalhos: ' + error.toString() });
  }
} 