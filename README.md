# 🍰 Doce Sensações - Sistema Completo

Sistema completo de e-commerce para doceria, com frontend moderno e backend robusto.

## 🚀 Arquitetura

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js + Express + PostgreSQL
- **Deploy**: 
  - Backend: Render
  - Frontend: Vercel
  - Banco: PostgreSQL (Render)

## 📋 Funcionalidades

### 👤 Usuários
- Cadastro e login de usuários
- Perfil personalizado
- Histórico de pedidos
- Sistema de avaliações

### 🍰 Produtos
- Catálogo de produtos
- Categorias (Doces, Bolos, Tortas)
- Imagens e descrições
- Controle de estoque

### 🛒 Carrinho e Pedidos
- Carrinho de compras
- Finalização de pedidos
- Acompanhamento de status
- Histórico completo

### 🔐 Autenticação
- Login seguro com JWT
- Controle de sessão
- Área administrativa
- Proteção de rotas

## 🛠️ Tecnologias

### Frontend
- HTML5, CSS3, JavaScript ES6+
- LocalStorage para persistência
- Fetch API para requisições
- Design responsivo

### Backend
- Node.js + Express
- PostgreSQL (Render)
- JWT para autenticação
- CORS configurado
- Rate limiting
- Helmet para segurança

## 🚀 Deploy

### Backend (Render)
- **URL**: https://docesensacoes-2.onrender.com
- **Status**: ✅ Online
- **Banco**: PostgreSQL inicializado

### Frontend (Vercel)
- **URL**: [Será gerada após deploy]
- **Status**: 🔄 Em preparação

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Cadastro de usuário

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto
- `GET /api/products/category/:category` - Produtos por categoria

### Pedidos
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/:id` - Buscar pedido
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/:id` - Atualizar pedido

### Avaliações
- `GET /api/reviews` - Listar avaliações
- `POST /api/reviews` - Criar avaliação

## 🔧 Configuração Local

### Pré-requisitos
- Node.js 18+
- Git

### Instalação
```bash
# Clonar repositório
git clone https://github.com/gopedrow/docesensacoes.git
cd docesensacoes

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas configurações

# Inicializar banco (se local)
npm run init-db

# Rodar servidor
npm start
```

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=3000
```

## 🧪 Testes

### Teste da API
```bash
# Teste de conectividade
curl https://docesensacoes-2.onrender.com/api/test

# Listar produtos
curl https://docesensacoes-2.onrender.com/api/products

# Listar usuários
curl https://docesensacoes-2.onrender.com/api/users
```

### Teste do Frontend
1. Abra `teste-frontend-render.html` no navegador
2. Teste carregamento de produtos
3. Teste login com admin@docesensacoes.com / admin123
4. Teste funcionalidades do carrinho

## 👤 Usuário Admin Padrão
- **Email**: admin@docesensacoes.com
- **Senha**: admin123

## 📊 Status do Projeto

- ✅ Backend funcionando no Render
- ✅ Banco de dados inicializado
- ✅ API endpoints funcionando
- ✅ Frontend atualizado para nova API
- ✅ Testes de integração passando
- 🔄 Deploy do frontend em andamento
- ⏳ Documentação em atualização

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do GitHub Issues.

---

**Desenvolvido com ❤️ para Doce Sensações** 