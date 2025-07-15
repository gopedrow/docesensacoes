class ProductStockCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'product-id', 'name', 'description', 'price', 'category', 'image', 'discount', 'status', 'modalidade'
    ];
  }

  async connectedCallback() {
    const templateUrl = '/src/componentes/product-stock-card.html';
    const response = await fetch(templateUrl);
    const html = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const template = tempDiv.querySelector('.product-stock-card');
    if (!template) return;
    let tpl = template.outerHTML;
    // Preencher placeholders
    tpl = tpl
      .replace(/{{PRODUCT_ID}}/g, this.getAttribute('product-id') || '')
      .replace(/{{PRODUCT_NAME}}/g, this.getAttribute('name') || '')
      .replace(/{{PRODUCT_DESCRIPTION}}/g, this.getAttribute('description') || 'Descrição não disponível')
      .replace(/{{PRODUCT_PRICE}}/g, this.getAttribute('price') ? parseFloat(this.getAttribute('price')).toFixed(2).replace('.', ',') : '0,00')
      .replace(/{{PRODUCT_CATEGORY}}/g, this.getAttribute('category') || 'Sem categoria')
      .replace(/{{PRODUCT_IMAGE}}/g, this.getAttribute('image') || 'dish.png')
      .replace(/{{PRODUCT_DISCOUNT}}/g, this.getAttribute('discount') || '0')
      .replace(/{{PRODUCT_STATUS}}/g, this.getAttribute('status') || '')
      .replace(/{{PRODUCT_MODALIDADE}}/g, this.getAttribute('modalidade') || '');
    this.shadowRoot.innerHTML = tpl;
    // Adiciona estilos globais do template
    const style = tempDiv.querySelector('style');
    if (style) {
      this.shadowRoot.appendChild(style.cloneNode(true));
    }
  }

  attributeChangedCallback() {
    this.connectedCallback();
  }
}
customElements.define('product-stock-card', ProductStockCard); 