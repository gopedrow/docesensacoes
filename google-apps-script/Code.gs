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
      case 'cadastrarProduto':
        return cadastrarProduto(postData.produto);
      case 'getProdutos':
        return getProdutos();
      case 'getProduto':
        const produtoId = e.parameter ? e.parameter.id : null;
        return getProduto(produtoId);
      
      // Usuários
      case 'createUsuario':
        return createUsuario(postData.usuario);
      case 'loginUsuario':
        return loginUsuario(postData.credentials);
      case 'getUsuario':
        const usuarioId = e.parameter ? e.parameter.id : null;
        return getUsuario(usuarioId);
      
      // Pedidos
      case 'createPedido':
        return createPedido(postData.pedido);
      case 'getPedidos':
        const pedidoUsuarioId = e.parameter ? e.parameter.usuarioId : null;
        return getPedidos(pedidoUsuarioId);
      case 'updatePedidoStatus':
        return updatePedidoStatus(postData.pedidoId, postData.status);
      
      // Avaliações
      case 'createAvaliacao':
        return createAvaliacao(postData.avaliacao);
      case 'getAvaliacoes':
        const avaliacaoProdutoId = e.parameter ? e.parameter.produtoId : null;
        return getAvaliacoes(avaliacaoProdutoId);
      
      default:
        return createResponse(400, { error: 'Ação não reconhecida: ' + action });
    }
  } catch (error) {
    console.error('Erro na API:', error);
    return createResponse(500, { error: 'Erro interno: ' + error.toString() });
  }
}

// ===== FUNÇÕES DE PRODUTOS =====

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

// ===== FUNÇÕES DE USUÁRIOS =====

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
      usuario.senha, // Em produção, deve ser criptografada
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

// Função para buscar usuário específico
function getUsuario(id) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Usuarios');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id && data[i][7] === true) {
        return createResponse(200, {
          usuario: {
            id: data[i][0],
            nome: data[i][1],
            email: data[i][2],
            telefone: data[i][3],
            endereco: data[i][4],
            dataCadastro: data[i][6]
          }
        });
      }
    }
    
    return createResponse(404, { error: 'Usuário não encontrado' });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar usuário: ' + error.toString() });
  }
}

// ===== FUNÇÕES DE PEDIDOS =====

// Função para criar pedido
function createPedido(pedido) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Pedidos');
    
    if (!sheet) {
      // Criar aba se não existir
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = spreadsheet.insertSheet('Pedidos');
      
      // Adicionar cabeçalhos
      newSheet.getRange(1, 1, 1, 8).setValues([
        ['ID', 'UsuarioID', 'Produtos', 'Total', 'Status', 'Forma Entrega', 'Observacoes', 'Data Pedido']
      ]);
      
      // Formatar cabeçalhos
      newSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#f0f0f0');
      
      return createPedido(pedido); // Tentar novamente
    }
    
    // Validar dados obrigatórios
    if (!pedido.usuarioId || !pedido.produtos || !pedido.total) {
      return createResponse(400, { error: 'Dados obrigatórios não fornecidos' });
    }
    
    // Preparar dados para inserção
    const rowData = [
      pedido.id || Math.floor(Math.random() * 9000) + 1000,
      pedido.usuarioId,
      JSON.stringify(pedido.produtos),
      pedido.total,
      pedido.status || 'pendente',
      pedido.formaEntrega || 'retirada',
      pedido.observacoes || '',
      pedido.dataPedido || new Date().toISOString()
    ];
    
    // Inserir na planilha
    sheet.appendRow(rowData);
    
    return createResponse(200, { 
      message: 'Pedido criado com sucesso',
      pedido: {
        id: rowData[0],
        usuarioId: rowData[1],
        produtos: JSON.parse(rowData[2]),
        total: rowData[3],
        status: rowData[4],
        formaEntrega: rowData[5],
        observacoes: rowData[6],
        dataPedido: rowData[7]
      }
    });
    
  } catch (error) {
    return createResponse(500, { error: 'Erro ao criar pedido: ' + error.toString() });
  }
}

// Função para buscar pedidos de um usuário
function getPedidos(usuarioId) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Pedidos');
    
    if (!sheet) {
      return createResponse(404, { error: 'Aba Pedidos não encontrada' });
    }
    
    const data = sheet.getDataRange().getValues();
    const pedidos = [];
    
    // Pular cabeçalho (primeira linha)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (row[1] == usuarioId) {
        pedidos.push({
          id: row[0],
          usuarioId: row[1],
          produtos: JSON.parse(row[2]),
          total: row[3],
          status: row[4],
          formaEntrega: row[5],
          observacoes: row[6],
          dataPedido: row[7]
        });
      }
    }
    
    return createResponse(200, { pedidos: pedidos });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar pedidos: ' + error.toString() });
  }
}

// Função para atualizar status do pedido
function updatePedidoStatus(pedidoId, status) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Pedidos');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == pedidoId) {
        sheet.getRange(i + 1, 5).setValue(status);
        return createResponse(200, { message: 'Status do pedido atualizado com sucesso' });
      }
    }
    
    return createResponse(404, { error: 'Pedido não encontrado' });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao atualizar status: ' + error.toString() });
  }
}

// ===== FUNÇÕES DE AVALIAÇÕES =====

// Função para criar avaliação
function createAvaliacao(avaliacao) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Avaliacoes');
    
    if (!sheet) {
      // Criar aba se não existir
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = spreadsheet.insertSheet('Avaliacoes');
      
      // Adicionar cabeçalhos
      newSheet.getRange(1, 1, 1, 7).setValues([
        ['ID', 'ProdutoID', 'UsuarioID', 'Nota', 'Comentario', 'Data Avaliacao', 'Ativo']
      ]);
      
      // Formatar cabeçalhos
      newSheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#f0f0f0');
      
      return createAvaliacao(avaliacao); // Tentar novamente
    }
    
    // Validar dados obrigatórios
    if (!avaliacao.produtoId || !avaliacao.usuarioId || !avaliacao.nota) {
      return createResponse(400, { error: 'Dados obrigatórios não fornecidos' });
    }
    
    // Preparar dados para inserção
    const rowData = [
      avaliacao.id || Math.floor(Math.random() * 9000) + 1000,
      avaliacao.produtoId,
      avaliacao.usuarioId,
      avaliacao.nota,
      avaliacao.comentario || '',
      avaliacao.dataAvaliacao || new Date().toISOString(),
      true
    ];
    
    // Inserir na planilha
    sheet.appendRow(rowData);
    
    return createResponse(200, { 
      message: 'Avaliação criada com sucesso',
      avaliacao: {
        id: rowData[0],
        produtoId: rowData[1],
        usuarioId: rowData[2],
        nota: rowData[3],
        comentario: rowData[4],
        dataAvaliacao: rowData[5]
      }
    });
    
  } catch (error) {
    return createResponse(500, { error: 'Erro ao criar avaliação: ' + error.toString() });
  }
}

// Função para buscar avaliações de um produto
function getAvaliacoes(produtoId) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Avaliacoes');
    
    if (!sheet) {
      return createResponse(404, { error: 'Aba Avaliacoes não encontrada' });
    }
    
    const data = sheet.getDataRange().getValues();
    const avaliacoes = [];
    
    // Pular cabeçalho (primeira linha)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (row[1] == produtoId && row[6] === true) {
        avaliacoes.push({
          id: row[0],
          produtoId: row[1],
          usuarioId: row[2],
          nota: row[3],
          comentario: row[4],
          dataAvaliacao: row[5]
        });
      }
    }
    
    return createResponse(200, { avaliacoes: avaliacoes });
  } catch (error) {
    return createResponse(500, { error: 'Erro ao buscar avaliações: ' + error.toString() });
  }
}

// ===== FUNÇÃO UTILITÁRIA =====

// Função para criar resposta com headers CORS
function createResponse(statusCode, data) {
  const response = {
    status: statusCode,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  const output = ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Adicionar headers CORS
  output.addHeader('Access-Control-Allow-Origin', '*');
  output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.addHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  output.addHeader('Access-Control-Max-Age', '86400');
  
  return output;
} 