// Configuração da API do Google Apps Script
const API_CONFIG = {
    // URL da API do Google Apps Script
    BASE_URL: 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgxalsXT2eSDyjK3Spfw-9HTSk7PlEj9KB2hHIs13XlBAaTBOdXK6sYvDy0LRyxuIRu1buJwjfAkD8HVax_Ig1LzSBsX-HsQWZkMChDWPDa0c-VFNXb2Ja_ulgFdOyCtr_bsfgTRD3Lf7bGpe1aqYB4-0BHEUz1TJtLJbqWZl3STg_OX1WubeKJppB5XVmgCRZso6wkhSU4BPJlVqUkCzyj5PwAE9BCvOajnbowahOFzql544S4PKT1PnCRH_-Tbw08BtW68QlRyB26iwLsEDtWXYNJ6GenbFuZy4wuoXLTA5YFKnk&lib=MDIuHBhrQVj9xnYaRtC0wCa2SpajOThe6',
    
    // Endpoints da API
    ENDPOINTS: {
        // Produtos
        PRODUTOS: '?action=getProdutos',
        PRODUTO: '?action=getProduto',
        CREATE_PRODUTO: '?action=cadastrarProduto',
        
        // Usuários
        CREATE_USUARIO: '?action=createUsuario',
        LOGIN_USUARIO: '?action=loginUsuario',
        GET_USUARIO: '?action=getUsuario',
        UPDATE_USUARIO: '?action=updateUsuario',
        
        // Pedidos
        CREATE_PEDIDO: '?action=createPedido',
        GET_PEDIDOS: '?action=getPedidos',
        UPDATE_PEDIDO: '?action=updatePedido',
        
        // Avaliações
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
            console.log('Fazendo requisição para:', url);
            
            const options = {
                method: method,
                headers: {
                    'Accept': 'application/json'
                }
            };

            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
                options.headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(url, options);
            console.log('Status da resposta:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Resposta da API:', result);

            // Verificar se há erro na resposta
            if (result.status >= 200 && result.status < 300) {
                // Retornar diretamente os dados, não o wrapper
                return result.data;
            } else {
                throw new Error(result.data?.error || result.error || 'Erro na requisição');
            }
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }



    // Buscar todos os produtos
    async getProdutos() {
        try {
            const response = await this.makeRequest(API_CONFIG.ENDPOINTS.PRODUTOS);
            console.log('Produtos recebidos:', response);
            return response;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }

    // Buscar produto específico
    async getProduto(id) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.PRODUTO + `&id=${id}`);
    }

    // Criar novo produto
    async createProduto(produtoData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CREATE_PRODUTO, 'POST', produtoData);
    }

    // Criar novo usuário
    async createUsuario(usuarioData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CREATE_USUARIO, 'POST', usuarioData);
    }

    // Login de usuário
    async loginUsuario(loginData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.LOGIN_USUARIO, 'POST', loginData);
    }

    // Buscar usuário específico
    async getUsuario(id) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.GET_USUARIO + `&id=${id}`);
    }

    // Atualizar usuário
    async updateUsuario(usuarioData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.UPDATE_USUARIO, 'POST', usuarioData);
    }

    // Criar novo pedido
    async createPedido(pedidoData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.CREATE_PEDIDO, 'POST', pedidoData);
    }

    // Buscar pedidos de um usuário
    async getPedidos(usuarioId) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.GET_PEDIDOS + `&usuarioId=${usuarioId}`);
    }

    // Atualizar pedido
    async updatePedido(pedidoData) {
        return await this.makeRequest(API_CONFIG.ENDPOINTS.UPDATE_PEDIDO, 'POST', pedidoData);
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
        this.updateAuthUI();
    }

    // Fazer login
    async login(credentials) {
        try {
            const response = await apiService.loginUsuario(credentials);
            this.user = response.usuario;
            this.saveUser();
            this.updateAuthUI();
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Registrar novo usuário
    async register(usuarioData) {
        try {
            const response = await apiService.createUsuario(usuarioData);
            // Após registro bem-sucedido, fazer login automaticamente
            await this.login({
                email: usuarioData.email,
                senha: usuarioData.senha
            });
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
        // Redirecionar para página inicial
        if (window.location.pathname.includes('perfil') || window.location.pathname.includes('admin')) {
            window.location.href = '/index.html';
        }
    }

    // Verificar se está logado
    isLoggedIn() {
        return this.user !== null;
    }

    // Verificar se é administrador
    isAdmin() {
        return this.user && this.user.tipo === 'admin';
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
        const loginBtns = document.querySelectorAll('.btn-default');
        
        loginBtns.forEach(btn => {
            if (btn.textContent.trim() === 'Login') {
                if (this.isLoggedIn()) {
                    btn.innerHTML = `
                        <i class="fa-solid fa-user"></i>
                        ${this.user.nome}
                    `;
                    btn.onclick = () => this.showUserMenu();
                } else {
                    btn.innerHTML = 'Login';
                    btn.onclick = () => window.location.href = 'src/pages/login.html';
                }
            }
        });

        // Atualizar menu do usuário se existir
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.display = this.isLoggedIn() ? 'block' : 'none';
        }
    }

    // Mostrar menu do usuário
    showUserMenu() {
        const menu = document.createElement('div');
        menu.className = 'user-menu-dropdown';
        menu.innerHTML = `
            <div class="user-menu-content">
                <div class="user-info">
                    <i class="fa-solid fa-user"></i>
                    <span>${this.user.nome}</span>
                </div>
                <div class="user-menu-options">
                    <a href="src/pages/perfil.html">
                        <i class="fa-solid fa-user-edit"></i>
                        Meu Perfil
                    </a>
                    <a href="src/pages/meus-pedidos.html">
                        <i class="fa-solid fa-shopping-bag"></i>
                        Meus Pedidos
                    </a>
                    ${this.isAdmin() ? `
                        <a href="src/pages/admin-estoque-produtos.html">
                            <i class="fa-solid fa-cog"></i>
                            Administração
                        </a>
                    ` : ''}
                    <a href="#" onclick="authService.logout()">
                        <i class="fa-solid fa-sign-out-alt"></i>
                        Sair
                    </a>
                </div>
            </div>
        `;

        // Adicionar estilos
        const style = document.createElement('style');
        style.textContent = `
            .user-menu-dropdown {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .user-menu-content {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                min-width: 300px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .user-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #eee;
                margin-bottom: 1rem;
                font-weight: 600;
            }
            .user-menu-options {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .user-menu-options a {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem;
                text-decoration: none;
                color: #333;
                border-radius: 8px;
                transition: background-color 0.3s;
            }
            .user-menu-options a:hover {
                background-color: #f5f5f5;
            }
        `;
        document.head.appendChild(style);

        // Fechar menu ao clicar fora
        menu.onclick = (e) => {
            if (e.target === menu) {
                document.body.removeChild(menu);
            }
        };

        document.body.appendChild(menu);
    }

    // Verificar autenticação em páginas protegidas
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/src/pages/login.html';
            return false;
        }
        return true;
    }

    // Verificar se é admin em páginas administrativas
    requireAdmin() {
        if (!this.requireAuth()) return false;
        if (!this.isAdmin()) {
            alert('Acesso negado. Apenas administradores podem acessar esta página.');
            window.location.href = '/index.html';
            return false;
        }
        return true;
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