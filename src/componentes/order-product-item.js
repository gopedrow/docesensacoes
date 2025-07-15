class OrderProductItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'name', 'image', 'qty', 'price'
    ];
  }

  async connectedCallback() {
    const templateUrl = '/src/componentes/order-product-item.html';
    const response = await fetch(templateUrl);
    const html = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const template = tempDiv.querySelector('.order-product-item');
    if (!template) return;
    let tpl = template.outerHTML;
    tpl = tpl.replace(/\{\{PRODUCT_NAME\}\}/g, this.getAttribute('name') || '');
    tpl = tpl.replace(/\{\{PRODUCT_IMAGE\}\}/g, this.getAttribute('image') || '../images/dish.png');
    tpl = tpl.replace(/\{\{PRODUCT_QTY\}\}/g, this.getAttribute('qty') || '1');
    tpl = tpl.replace(/\{\{PRODUCT_PRICE\}\}/g, this.getAttribute('price') || '0,00');
    this.shadowRoot.innerHTML = tpl;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.connectedCallback();
    }
  }
}
customElements.define('order-product-item', OrderProductItem); 