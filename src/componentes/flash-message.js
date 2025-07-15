class FlashMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const type = this.getAttribute('type') || 'info';
    const message = this.getAttribute('message') || '';
    this.shadowRoot.innerHTML = `
      <style>
        .flash {
          position: fixed;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          min-width: 280px;
          max-width: 90vw;
          padding: 1rem 2rem;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          z-index: 9999;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          opacity: 0.98;
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .info { background: #4299e1; }
        .success { background: #38a169; }
        .error { background: #e53e3e; }
        .close-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          margin-left: 1rem;
          cursor: pointer;
        }
      </style>
      <div class="flash ${type}">
        <span>${message}</span>
        <button class="close-btn" title="Fechar">&times;</button>
      </div>
    `;
    this.shadowRoot.querySelector('.close-btn').onclick = () => this.remove();
    setTimeout(() => this.remove(), 5000);
  }
}
customElements.define('flash-message', FlashMessage); 