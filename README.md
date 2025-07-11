# 🍰 Doce Sensações

Site da confeitaria Doce Sensações - Especializada em delícias por delivery com cardápio variado de docinhos gourmet, cupcakes, alfajores, donuts e criações sazonais.

## 🌟 Características

- Design responsivo e moderno
- Integração com Google Apps Script para base de dados
- Sistema de carrinho de compras
- Área de login e cadastro
- Cardápio dinâmico
- Sistema de avaliações

## 🚀 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (jQuery)
- Google Apps Script
- Google Sheets (Base de dados)

## 📁 Estrutura do Projeto

```
docesensacoes/
├── index.html              # Página principal
├── src/
│   ├── css/               # Estilos CSS
│   ├── javascript/        # Scripts JavaScript
│   ├── images/           # Imagens do projeto
│   ├── componentes/      # Componentes reutilizáveis
│   └── pages/           # Páginas adicionais
├── google-apps-script/   # Scripts do Google Apps Script
└── README.md
```

## 🔧 Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/docesensacoes.git
cd docesensacoes
```

### 2. Configure o Google Apps Script

1. Acesse [Google Apps Script](https://script.google.com/)
2. Crie um novo projeto
3. Copie o código do arquivo `google-apps-script/Code.gs`
4. Configure as permissões necessárias
5. Publique como web app
6. Copie a URL da API e atualize no arquivo `src/javascript/config.js`

### 3. Configure o Google Sheets

1. Crie uma nova planilha no Google Sheets
2. Configure as abas conforme especificado no arquivo `google-apps-script/README.md`
3. Compartilhe a planilha com o email do Google Apps Script

## 🌐 Deploy no GitHub Pages

1. Faça push do código para o GitHub
2. Vá em Settings > Pages
3. Selecione a branch `main` como source
4. O site estará disponível em: `https://seu-usuario.github.io/docesensacoes`

## 📊 Estrutura da Base de Dados

### Tabelas no Google Sheets:

- **Produtos**: ID, Nome, Descrição, Preço, Categoria, Imagem, Ativo
- **Usuários**: ID, Nome, Email, Telefone, Endereço, Data Cadastro
- **Pedidos**: ID, UsuarioID, Produtos, Total, Status, Data
- **Avaliações**: ID, ProdutoID, UsuarioID, Nota, Comentário, Data

## 🔌 API Endpoints

- `GET /produtos` - Lista todos os produtos
- `POST /pedido` - Cria novo pedido
- `POST /usuario` - Cadastra novo usuário
- `GET /avaliacoes` - Lista avaliações de um produto

## 📱 Funcionalidades

- ✅ Navegação responsiva
- ✅ Cardápio dinâmico
- ✅ Sistema de carrinho
- ✅ Login e cadastro
- ✅ Área do cliente
- ✅ Sistema de avaliações
- ✅ Integração com WhatsApp
- ✅ Design moderno

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Telefone**: (62) 98648-3753
- **WhatsApp**: [Clique aqui](https://wa.me/5562986483753)
- **Instagram**: [@docesensacoes2020](https://www.instagram.com/docesensacoes2020)
- **TikTok**: [@ligiasthephany](https://www.tiktok.com/@ligiasthephany)

---

Desenvolvido com ❤️ para a Doce Sensações 