class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'product-id', 'name', 'description', 'price', 'category', 'image', 'stock', 'discount'
    ];
  }

  async connectedCallback() {
    const templateUrl = '/src/componentes/product-card.html';
    const response = await fetch(templateUrl);
    const html = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const template = tempDiv.querySelector('.product-card');
    if (!template) return;
    let tpl = template.outerHTML;
    // Preencher placeholders
    const precoOriginal = parseFloat(this.getAttribute('price') || 0);
    const desconto = parseFloat(this.getAttribute('discount') || 0);
    const precoFinal = desconto > 0 ? precoOriginal * (1 - desconto / 100) : precoOriginal;
    const showPromoBadge = desconto > 0 ? 'block' : 'none';
    const promoText = desconto > 0 ? `${desconto}% OFF` : '';
    const showOriginalPrice = desconto > 0 ? 'block' : 'none';
    tpl = tpl
      .replace(/{{PRODUCT_ID}}/g, this.getAttribute('product-id') || '')
      .replace(/{{PRODUCT_NAME}}/g, this.getAttribute('name') || '')
      .replace(/{{PRODUCT_DESCRIPTION}}/g, this.getAttribute('description') || 'Descrição não disponível')
      .replace(/{{PRODUCT_PRICE}}/g, precoFinal.toFixed(2).replace('.', ','))
      .replace(/{{ORIGINAL_PRICE}}/g, precoOriginal.toFixed(2).replace('.', ','))
      .replace(/{{PRODUCT_CATEGORY}}/g, this.getAttribute('category') || 'Sem categoria')
      .replace(/{{PRODUCT_IMAGE}}/g, `/src/images/${this.getAttribute('image') || 'dish.png'}`)
      .replace(/{{SHOW_PROMO_BADGE}}/g, showPromoBadge)
      .replace(/{{PROMO_TEXT}}/g, promoText)
      .replace(/{{SHOW_ORIGINAL_PRICE}}/g, showOriginalPrice);
    this.shadowRoot.innerHTML = tpl;
    // Adiciona estilos globais do template
    const style = tempDiv.querySelector('style');
    if (style) {
      this.shadowRoot.appendChild(style.cloneNode(true));
    }
  }

  attributeChangedCallback() {
    // Re-renderiza ao mudar atributos
    this.connectedCallback();
  }
}
customElements.define('product-card', ProductCard); 