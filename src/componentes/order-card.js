class OrderCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'order-id', 'order-date', 'order-status', 'order-status-text', 'order-total'
    ];
  }

  async connectedCallback() {
    const templateUrl = '/src/componentes/order-card.html';
    const response = await fetch(templateUrl);
    const html = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const template = tempDiv.querySelector('.order-card');
    if (!template) return;
    let tpl = template.outerHTML;
    tpl = tpl.replace(/\{\{ORDER_ID\}\}/g, this.getAttribute('order-id') || '');
    tpl = tpl.replace(/\{\{ORDER_DATE\}\}/g, this.getAttribute('order-date') || '');
    tpl = tpl.replace(/\{\{ORDER_STATUS\}\}/g, this.getAttribute('order-status') || '');
    tpl = tpl.replace(/\{\{ORDER_STATUS_TEXT\}\}/g, this.getAttribute('order-status-text') || '');
    tpl = tpl.replace(/\{\{ORDER_TOTAL\}\}/g, this.getAttribute('order-total') || '0,00');
    this.shadowRoot.innerHTML = tpl;
    // Adiciona slot para produtos
    const slot = document.createElement('slot');
    slot.name = 'products';
    this.shadowRoot.querySelector('.order-products').appendChild(slot);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.connectedCallback();
    }
  }
}
customElements.define('order-card', OrderCard); 