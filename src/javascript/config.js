// Configuração da API do Google Apps Script
const API_CONFIG = {
    // URL da API do Google Apps Script
    BASE_URL: 'https://script.google.com/macros/s/AKfycbzmVgtgUnDdi4LSJTfzueqJrjQnRVMg54ZJAsIPqXUF6nhN3Gxjjh_TxZ88ZurPXIgeNw/exec',
    
    // Endpoints da API
    ENDPOINTS: {
        PRODUTOS: '?action=getProdutos',
        PRODUTO: '?action=getProduto',
        CREATE_USUARIO: '?action=createUsuario',
        LOGIN_USUARIO: '?action=loginUsuario',
        CREATE_PEDIDO: '?action=createPedido',
        GET_PEDIDOS: '?action=getPedidos',
        CREATE_AVALIACAO: '?action=createAvaliacao',
        GET_AVALIACOES: '?action=getAvaliacoes'
    }
};

// Classe para gerenciar as chamadas da API
class APIService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    // Método genérico para fazer requisições
    async makeRequest(endpoint, method = 'GET', data = null) {
        try {
            const url = this.baseURL + endpoint;
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            const result = await response.json();

            if (result.statusCode >= 200 && result.statusCode < 300) {
                return result.data;
            } else {
                throw new Error(result.data.error || 'Erro na requisição');
            }
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }

    // Buscar todos os produtos
    async getProdutos() {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.PRODUTOS);
    }

    // Buscar produto específico
    async getProduto(id) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.PRODUTO + `&id=${id}`);
    }

    // Criar novo usuário
    async createUsuario(usuarioData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CREATE_USUARIO, 'POST', usuarioData);
    }

    // Login de usuário
    async loginUsuario(loginData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.LOGIN_USUARIO, 'POST', loginData);
    }

    // Criar novo pedido
    async createPedido(pedidoData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CREATE_PEDIDO, 'POST', pedidoData);
    }

    // Buscar pedidos de um usuário
    async getPedidos(usuarioId) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.GET_PEDIDOS + `&usuarioId=${usuarioId}`);
    }

    // Criar nova avaliação
    async createAvaliacao(avaliacaoData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CREATE_AVALIACAO, 'POST', avaliacaoData);
    }

    // Buscar avaliações de um produto
    async getAvaliacoes(produtoId) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.GET_AVALIACOES + `&produtoId=${produtoId}`);
    }
}

// Instância global da API
const apiService = new APIService();

// Funções utilitárias para o carrinho
class CartService {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    // Adicionar produto ao carrinho
    addToCart(produto, quantidade = 1) {
        const existingItem = this.cart.find(item => item.id === produto.id);
        
        if (existingItem) {
            existingItem.quantidade += quantidade;
        } else {
            this.cart.push({
                ...produto,
                quantidade: quantidade
            });
        }
        
        this.saveCart();
        this.updateCartUI();
    }

    // Remover produto do carrinho
    removeFromCart(produtoId) {
        this.cart = this.cart.filter(item => item.id !== produtoId);
        this.saveCart();
        this.updateCartUI();
    }

    // Atualizar quantidade
    updateQuantity(produtoId, quantidade) {
        const item = this.cart.find(item => item.id === produtoId);
        if (item) {
            item.quantidade = Math.max(1, quantidade);
            this.saveCart();
            this.updateCartUI();
        }
    }

    // Limpar carrinho
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    }

    // Calcular total
    getTotal() {
        return this.cart.reduce((total, item) => {
            return total + (parseFloat(item.preco) * item.quantidade);
        }, 0);
    }

    // Salvar carrinho no localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Atualizar interface do carrinho
    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantidade, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        if (cartTotal) {
            cartTotal.textContent = `R$ ${this.getTotal().toFixed(2)}`;
        }
    }

    // Obter carrinho
    getCart() {
        return this.cart;
    }
}

// Instância global do carrinho
const cartService = new CartService();

// Funções utilitárias para autenticação
class AuthService {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('user')) || null;
    }

    // Fazer login
    async login(email) {
        try {
            const response = await apiService.loginUsuario({ email });
            this.user = response.usuario;
            this.saveUser();
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Fazer logout
    logout() {
        this.user = null;
        localStorage.removeItem('user');
        this.updateAuthUI();
    }

    // Verificar se está logado
    isLoggedIn() {
        return this.user !== null;
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.user;
    }

    // Salvar usuário no localStorage
    saveUser() {
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    // Atualizar interface de autenticação
    updateAuthUI() {
        const loginBtn = document.querySelector('.btn-default');
        const userMenu = document.getElementById('user-menu');
        
        if (this.isLoggedIn()) {
            if (loginBtn) {
                loginBtn.textContent = this.user.nome;
                loginBtn.onclick = () => this.showUserMenu();
            }
            if (userMenu) {
                userMenu.style.display = 'block';
            }
        } else {
            if (loginBtn) {
                loginBtn.textContent = 'Login';
                loginBtn.onclick = () => window.location.href = 'src/pages/login.html';
            }
            if (userMenu) {
                userMenu.style.display = 'none';
            }
        }
    }

    // Mostrar menu do usuário
    showUserMenu() {
        // Implementar menu dropdown do usuário
        console.log('Menu do usuário:', this.user);
    }
}

// Instância global de autenticação
const authService = new AuthService();

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar interfaces
    cartService.updateCartUI();
    authService.updateAuthUI();
    
    // Carregar produtos se estiver na página principal
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadProdutos();
    }
});

// Função para carregar produtos na página principal
async function loadProdutos() {
    try {
        const response = await apiService.getProdutos();
        if (response && response.produtos) {
            displayProdutos(response.produtos);
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Fallback para produtos estáticos se a API falhar
        displayProdutosFallback();
    }
}

// Função para exibir produtos
function displayProdutos(produtos) {
    const dishesContainer = document.getElementById('dishes');
    if (!dishesContainer) return;

    dishesContainer.innerHTML = '';
    
    produtos.forEach(produto => {
        const dishHTML = `
            <div class="dish" data-id="${produto.id}">
                <div class="dish-heart">
                    <i class="fa-solid fa-heart"></i>
                </div>

                <img src="src/images/${produto.imagem}" class="dish-image" alt="${produto.nome}">

                <h3 class="dish-title">
                    ${produto.nome}
                </h3>

                <span class="dish-description">
                    ${produto.descricao}
                </span>

                <div class="dish-rate">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <span>(500+)</span>
                </div>

                <div class="dish-price">
                    <h4>R$${parseFloat(produto.preco).toFixed(2)}</h4>
                    <button class="btn-default" onclick="addToCart('${produto.id}')">
                        <i class="fa-solid fa-basket-shopping"></i>
                    </button>
                </div>
            </div>
        `;
        dishesContainer.innerHTML += dishHTML;
    });
}

// Função fallback para produtos estáticos
function displayProdutosFallback() {
    console.log('Usando produtos estáticos como fallback');
    // Os produtos já estão no HTML, então não precisa fazer nada
}

// Função global para adicionar ao carrinho
function addToCart(produtoId) {
    // Buscar dados do produto
    const produtoElement = document.querySelector(`[data-id="${produtoId}"]`);
    if (produtoElement) {
        const nome = produtoElement.querySelector('.dish-title').textContent.trim();
        const preco = produtoElement.querySelector('.dish-price h4').textContent.replace('R$', '').trim();
        const imagem = produtoElement.querySelector('.dish-image').src.split('/').pop();
        
        const produto = {
            id: produtoId,
            nome: nome,
            preco: parseFloat(preco),
            imagem: imagem
        };
        
        cartService.addToCart(produto);
        
        // Feedback visual
        showNotification('Produto adicionado ao carrinho!', 'success');
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Adicionar estilos CSS para animação
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style); 