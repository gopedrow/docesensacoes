// Script para cadastro de produtos - Integração com Google Sheets
// Configuração da API do Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjHv5DIdmKIkCQU8NBfyZqNRCAbXyCxs0cUTGUMl3dEhX8BGz5QelTUh1nOcAYrW2VCxHAa7bPDx9_K9pztiQtx20WK3qjpwSpanmiNqQBb9sF5eMB9apVxjpjLpTeHqqTLaY-SF7002qgHxRfxzvSkXD8Jwl3Sv4w5XExBzYBo2ErHt4JwhJlaK_Mq4hC5zi-U_P-ntYf6-NDHuNregusFqIav51nV3XFi-1wFH0UEZo5GoYz6egZWGBFw79M0njOAm7_o_Tzg8lC1L55caLGPvgM7LKmBd390E1LNO5k7YnpsEis&lib=MKRtSNsMvzxg3R8tEy8_u9K2SpajOThe6';

// Função para enviar dados do formulário para o Google Sheets
async function enviarProdutoParaGoogleSheets(dadosProduto) {
  try {
    console.log('Tentando enviar para Google Sheets:', dadosProduto);

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'cadastrarProduto',
        produto: dadosProduto
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const resultado = await response.json();
    console.log('Resposta do Google Sheets:', resultado);

    if (resultado.status === 200) {
      return { sucesso: true, mensagem: 'Produto cadastrado no Google Sheets!', dados: resultado.data };
    } else {
      throw new Error(resultado.error || 'Erro desconhecido');
    }

  } catch (error) {
    console.log('Erro ao enviar para Google Sheets, usando localStorage:', error.message);
    
    // Fallback para localStorage
    return salvarProdutoLocalStorage(dadosProduto);
  }
}

// Função para salvar produto no localStorage (fallback)
function salvarProdutoLocalStorage(dadosProduto) {
  try {
    // Obter produtos existentes
    const produtosExistentes = JSON.parse(localStorage.getItem('produtos') || '[]');
    
    // Adicionar novo produto
    const novoProduto = {
      ...dadosProduto,
      id: dadosProduto.id || Math.floor(Math.random() * 9000) + 1000,
      dataCadastro: new Date().toISOString()
    };
    
    produtosExistentes.push(novoProduto);
    
    // Salvar no localStorage
    localStorage.setItem('produtos', JSON.stringify(produtosExistentes));
    
    console.log('Produto salvo no localStorage:', novoProduto);
    
    return { 
      sucesso: true, 
      mensagem: 'Produto cadastrado localmente! (Google Sheets indisponível)', 
      dados: novoProduto 
    };
    
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
    return { sucesso: false, mensagem: `Erro ao salvar: ${error.message}` };
  }
}

// Função para processar imagem (converter para base64)
function processarImagem(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Função para validar dados do formulário
function validarFormulario(dados) {
  const erros = [];

  if (!dados.nome || dados.nome.trim().length < 3) {
    erros.push('Nome deve ter pelo menos 3 caracteres');
  }

  if (!dados.descricao || dados.descricao.trim().length < 10) {
    erros.push('Descrição deve ter pelo menos 10 caracteres');
  }

  if (!dados.preco || dados.preco <= 0) {
    erros.push('Preço deve ser maior que zero');
  }

  if (!dados.categoria) {
    erros.push('Categoria é obrigatória');
  }

  if (!dados.modalidade || dados.modalidade.length === 0) {
    erros.push('Selecione pelo menos uma modalidade');
  }

  if (!dados.status) {
    erros.push('Status é obrigatório');
  }

  return erros;
}

// Função para coletar dados do formulário
function coletarDadosFormulario() {
  const form = document.getElementById('produto-form');
  const formData = new FormData(form);

  // Coletar modalidades selecionadas
  const modalidades = [];
  const checkboxes = document.querySelectorAll('#multiselect-modalidade input[type="checkbox"]:checked');
  checkboxes.forEach(cb => modalidades.push(cb.value));

  const dados = {
    id: parseInt(formData.get('id')),
    nome: formData.get('nome').trim(),
    descricao: formData.get('descricao').trim(),
    preco: parseFloat(formData.get('preco')),
    categoria: formData.get('categoria'),
    modalidade: modalidades,
    desconto: parseFloat(formData.get('desconto')) || 0,
    status: formData.get('status'),
    imagem: null, // Será processada separadamente
    dataCadastro: new Date().toISOString()
  };

  return dados;
}

// Função principal para cadastrar produto
async function cadastrarProduto() {
  try {
    // Mostrar loading
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
    submitBtn.disabled = true;

    // Coletar dados do formulário
    const dados = coletarDadosFormulario();

    // Validar dados
    const erros = validarFormulario(dados);
    if (erros.length > 0) {
      throw new Error('Erros de validação:\n' + erros.join('\n'));
    }

    // Processar imagem se existir
    const inputImagem = document.getElementById('imagem');
    if (inputImagem.files.length > 0) {
      const imagemBase64 = await processarImagem(inputImagem.files[0]);
      dados.imagem = imagemBase64;
    }

    // Enviar para Google Sheets (com fallback para localStorage)
    const resultado = await enviarProdutoParaGoogleSheets(dados);

    if (resultado.sucesso) {
      // Sucesso
      mostrarMensagem('success', resultado.mensagem);
      
      // Limpar formulário
      document.getElementById('produto-form').reset();
      
      // Gerar novo ID
      const idInput = document.getElementById('id');
      const randomId = Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;
      idInput.value = randomId;
      
      // Resetar multiselect
      resetarMultiselect();
      
      console.log('Produto cadastrado:', resultado.dados);
      
    } else {
      // Erro
      throw new Error(resultado.mensagem);
    }

  } catch (error) {
    console.error('Erro no cadastro:', error);
    mostrarMensagem('error', error.message);
  } finally {
    // Restaurar botão
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Cadastrar Produto';
    submitBtn.disabled = false;
  }
}

// Função para mostrar mensagens
function mostrarMensagem(tipo, mensagem) {
  // Remover mensagens anteriores
  const mensagensExistentes = document.querySelectorAll('.mensagem-sistema');
  mensagensExistentes.forEach(msg => msg.remove());

  // Criar nova mensagem
  const mensagemDiv = document.createElement('div');
  mensagemDiv.className = `mensagem-sistema mensagem-${tipo}`;
  mensagemDiv.innerHTML = `
    <div class="mensagem-conteudo">
      <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${mensagem}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="fechar-mensagem">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  // Adicionar estilos
  mensagemDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
    background: ${tipo === 'success' ? '#34c759' : '#ff3b30'};
  `;

  // Adicionar ao DOM
  document.body.appendChild(mensagemDiv);

  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    if (mensagemDiv.parentElement) {
      mensagemDiv.remove();
    }
  }, 5000);
}

// Função para resetar multiselect
function resetarMultiselect() {
  const checkboxes = document.querySelectorAll('#multiselect-modalidade input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
  
  const button = document.querySelector('.multiselect-button');
  button.textContent = 'Selecione...';
  
  // Re-add arrow
  const arrow = document.createElement('span');
  arrow.className = 'multiselect-arrow';
  arrow.innerHTML = '&#9662;';
  button.appendChild(arrow);
}

// Função para testar conexão com Google Apps Script
async function testarConexao() {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL + '&action=teste');
    const resultado = await response.json();
    
    if (resultado.status === 200) {
      console.log('✅ Conexão com Google Apps Script OK');
      return true;
    } else {
      console.error('❌ Erro na conexão:', resultado.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error);
    return false;
  }
}

// Função para obter produtos do localStorage
function obterProdutosLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem('produtos') || '[]');
  } catch (error) {
    console.error('Erro ao obter produtos do localStorage:', error);
    return [];
  }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script de cadastro de produtos carregado');
  
  // Testar conexão
  testarConexao();
  
  // Adicionar listener ao formulário
  const form = document.getElementById('produto-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      cadastrarProduto();
    });
  }
});

// Adicionar estilos CSS para mensagens
const estilosMensagem = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .mensagem-conteudo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .fechar-mensagem {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.25rem;
    margin-left: auto;
  }
  
  .fechar-mensagem:hover {
    opacity: 0.8;
  }
`;

// Injetar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = estilosMensagem;
document.head.appendChild(styleSheet); 