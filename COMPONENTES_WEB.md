# Padrão de Web Components no Projeto Doce Sensações

Este documento explica como criar, usar e manter Web Components reutilizáveis para exibição de cards (produtos, pedidos, avaliações, etc.) em todas as páginas do sistema.

---

## 1. O que são Web Components?
Web Components são elementos HTML personalizados, encapsulados e reutilizáveis, criados com JavaScript. Eles facilitam a manutenção, o reuso e a padronização visual do sistema.

---

## 2. Como criar um novo Web Component

1. **Crie um template HTML** em `src/componentes/` (ex: `product-card.html`, `order-card.html`, `review-card.html`).
   - Use placeholders como `{{NOME}}`, `{{PRECO}}`, etc.
2. **Crie o arquivo JS do componente** (ex: `product-card.js`):
   - Carregue o template via `fetch`.
   - Substitua os placeholders pelos atributos recebidos.
   - Use `this.attachShadow({mode: 'open'})` para encapsular o visual.
   - Registre o componente com `customElements.define('nome-do-componente', ClasseDoComponente)`.

### Exemplo básico:
```js
class ProductCard extends HTMLElement {
  constructor() { super(); this.attachShadow({mode: 'open'}); }
  static get observedAttributes() { return ['name', 'price']; }
  async connectedCallback() {
    const resp = await fetch('/src/componentes/product-card.html');
    let html = await resp.text();
    html = html.replace(/\{\{NOME\}\}/g, this.getAttribute('name') || '');
    html = html.replace(/\{\{PRECO\}\}/g, this.getAttribute('price') || '');
    this.shadowRoot.innerHTML = html;
  }
  attributeChangedCallback() { this.connectedCallback(); }
}
customElements.define('product-card', ProductCard);
```

---

## 3. Como usar um Web Component em qualquer página
1. **Inclua o JS do componente** no `<head>` ou antes do fechamento do `<body>`:
   ```html
   <script src="../componentes/product-card.js"></script>
   ```
2. **Use o componente no HTML**:
   ```html
   <product-card name="Brigadeiro Gourmet" price="3.50"></product-card>
   ```
3. **Para listas dinâmicas**, crie os elementos via JS e defina os atributos.

---

## 4. Centralização e atualização de templates
- **Altere o HTML do template** (ex: `product-card.html`) para atualizar o visual em todas as páginas.
- **Adicione/remova atributos** no JS do componente para expandir funcionalidades.

---

## 5. Boas práticas
- **Nomeie os componentes** com hífen (ex: `order-card`, `review-card`).
- **Use Shadow DOM** para evitar conflitos de CSS.
- **Documente atributos obrigatórios e opcionais** no início do JS do componente.
- **Prefira slots** para conteúdo dinâmico (ex: lista de produtos dentro de um pedido).

---

## 6. Exemplos de componentes já implementados
- `<product-card>`: Exibe um produto do cardápio.
- `<product-stock-card>`: Exibe um produto no estoque/admin.
- `<order-product-item>`: Exibe um produto dentro de um pedido.
- `<order-card>`: Exibe um pedido completo.
- `<review-card>`: (pronto para uso futuro)

---

## 7. Como expandir
- Crie novos templates e JS seguindo o padrão acima.
- Atualize as páginas para usar os novos componentes.
- Consulte este arquivo sempre que for criar ou modificar um componente.

---

## 8. Exemplo de uso dinâmico via JavaScript

```js
const card = document.createElement('product-card');
card.setAttribute('name', 'Beijinho');
card.setAttribute('price', '2.50');
document.getElementById('products-container').appendChild(card);
```

---

## 9. Atualizando atributos dinamicamente

```js
card.setAttribute('price', '3.00'); // O componente se atualiza automaticamente
```

---

## 10. Exemplo de uso de slot

No template HTML:
```html
<div class="order-card">
  ...
  <div class="order-products">
    <slot name="products"></slot>
  </div>
  ...
</div>
```
No uso:
```html
<order-card ...>
  <order-product-item slot="products" ...></order-product-item>
  <order-product-item slot="products" ...></order-product-item>
</order-card>
```

---

## 11. Dica sobre estilos globais e Shadow DOM
- O CSS definido dentro do Shadow DOM do componente **não afeta** o restante da página.
- Para customizar visual globalmente, altere o template HTML do componente.
- Se precisar expor variáveis CSS, use `:host {}` no template do componente.

---

## 12. Documentação de atributos no JS do componente
No início do arquivo JS do componente, adicione um comentário assim:
```js
/**
 * <product-card>
 * Atributos:
 * - name (string): Nome do produto
 * - price (string|number): Preço do produto
 * - image (string): URL da imagem
 * - ...
 */
```

Dúvidas? Consulte os exemplos nos arquivos de componentes ou peça orientação à equipe técnica. 

---

## 13. Exemplo de feedback global para promoções/admin

```js
async function cadastrarPromocao(dados) {
  try {
    // await apiService.createPromocao(dados);
    setFlashMessage('Promoção cadastrada com sucesso!', 'success');
    window.location.reload();
  } catch (error) {
    setFlashMessage('Erro ao cadastrar promoção. Tente novamente.', 'error');
    window.location.reload();
  }
}
```

Esse padrão pode ser aplicado para qualquer ação administrativa (criar, editar, remover usuários, categorias, promoções, etc).

---

## 14. Tratamento de erros globais

Sempre que uma ação importante falhar (ex: rede, permissão, dados inválidos), use:

```js
setFlashMessage('Erro ao realizar ação. Tente novamente.', 'error');
window.location.reload();
```

--- 