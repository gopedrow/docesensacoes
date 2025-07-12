# Componentes Reutilizáveis

Este diretório contém componentes reutilizáveis para o sistema Doce Sensações.

## Product Stock Card (`product-stock-card.html`)

Componente para exibir cards de produtos no sistema de estoque/admin.

### Como usar:

1. **Incluir o componente:**
```html
<script src="../componentes/product-stock-card.html"></script>
```

2. **Definir funções de callback (opcional):**
```javascript
// Função chamada quando clicar em "Editar"
window.onEditProduct = function(productId) {
  // Sua lógica de edição aqui
  console.log('Editar produto:', productId);
};

// Função chamada quando clicar em "Excluir"
window.onDeleteProduct = function(productId) {
  // Sua lógica de exclusão aqui
  if (confirm('Tem certeza?')) {
    // Excluir produto
  }
};
```

3. **Renderizar cards:**
```javascript
// Renderizar múltiplos produtos
renderProductCards(produtos, 'container-id');

// Renderizar um produto individual
const cardHTML = renderProductCard(produto);
```

4. **Atualizar estatísticas:**
```javascript
updateProductStats(produtos);
```

### Estrutura do objeto produto:

```javascript
const produto = {
  id: 1001,                    // ID único do produto
  nome: "Brigadeiro Gourmet",  // Nome do produto
  descricao: "Descrição...",   // Descrição completa
  preco: 3.50,                 // Preço em número
  categoria: "Doce/Recheado",  // Categoria do produto
  modalidade: ["pronta_entrega", "encomendas"], // Array de modalidades
  desconto: 10,                // Desconto em porcentagem (0-100)
  status: "ativo",             // "ativo", "inativo", "pendente"
  imagem: "url-da-imagem"      // URL da imagem do produto
};
```

### Modalidades disponíveis:

- `pronta_entrega` → "Pronta Entrega"
- `encomendas` → "Encomendas"
- `sob_demanda` → "Sob Demanda"
- `importado` → "Importado"
- `outros` → "Outros"

### Status disponíveis:

- `ativo` → Badge verde "Ativo"
- `inativo` → Badge vermelho "Inativo"
- `pendente` → Badge laranja "Pendente"

### Exemplo completo:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="../componentes/product-stock-card.html"></script>
</head>
<body>
  <div id="products-container"></div>
  
  <script>
    const produtos = [
      {
        id: 1001,
        nome: "Brigadeiro Gourmet",
        descricao: "Brigadeiro tradicional com chocolate belga.",
        preco: 3.50,
        categoria: "Doce/Recheado",
        modalidade: ["pronta_entrega", "encomendas"],
        desconto: 10,
        status: "ativo",
        imagem: "https://exemplo.com/imagem.jpg"
      }
    ];

    // Definir callbacks
    window.onEditProduct = (id) => alert(`Editar ${id}`);
    window.onDeleteProduct = (id) => {
      if (confirm('Excluir?')) {
        // Lógica de exclusão
      }
    };

    // Renderizar
    renderProductCards(produtos, 'products-container');
    updateProductStats(produtos);
  </script>
</body>
</html>
```

### Características do componente:

- ✅ **Design responsivo** - Adapta-se a diferentes telas
- ✅ **Animações suaves** - Hover effects e transições
- ✅ **Fallback de imagem** - Placeholder quando imagem não carrega
- ✅ **Formatação automática** - Preços em Real brasileiro
- ✅ **Badges coloridos** - Status e desconto visualmente distintos
- ✅ **Tags de modalidade** - Exibição organizada das modalidades
- ✅ **Callbacks flexíveis** - Funções personalizáveis para ações
- ✅ **Estatísticas automáticas** - Cálculo de totais e contadores

### CSS incluído:

O componente inclui todos os estilos necessários:
- Cards com glassmorphism
- Badges de status coloridos
- Tags de modalidade
- Botões de ação
- Animações e hover effects
- Layout responsivo 