// PWA Installation and Service Worker Management
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.installButton = null;
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.checkForUpdates();
  }

  // Registrar Service Worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado com sucesso:', registration);

        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });

      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  }

  // Configurar prompt de instalação
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Verificar se já está instalado
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalado com sucesso!');
      this.hideInstallButton();
      this.deferredPrompt = null;
    });
  }

  // Mostrar botão de instalação
  showInstallButton() {
    // Criar botão de instalação se não existir
    if (!this.installButton) {
      this.installButton = document.createElement('button');
      this.installButton.className = 'pwa-install-btn';
      this.installButton.innerHTML = `
        <i class="fa-solid fa-download"></i>
        Instalar App
      `;
      this.installButton.addEventListener('click', () => this.installPWA());
      
      // Adicionar estilos
      this.installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-primary-6);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
      `;

      this.installButton.addEventListener('mouseenter', () => {
        this.installButton.style.transform = 'scale(1.05)';
      });

      this.installButton.addEventListener('mouseleave', () => {
        this.installButton.style.transform = 'scale(1)';
      });

      document.body.appendChild(this.installButton);
    }
  }

  // Esconder botão de instalação
  hideInstallButton() {
    if (this.installButton) {
      this.installButton.remove();
      this.installButton = null;
    }
  }

  // Instalar PWA
  async installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
      } else {
        console.log('Usuário rejeitou a instalação');
      }
      
      this.deferredPrompt = null;
      this.hideInstallButton();
    }
  }

  // Verificar atualizações
  checkForUpdates() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Nova versão do app disponível!');
        this.showUpdateNotification();
      });
    }
  }

  // Mostrar notificação de atualização
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'pwa-update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <i class="fa-solid fa-sync-alt"></i>
        <span>Nova versão disponível!</span>
        <button onclick="location.reload()">Atualizar</button>
        <button onclick="this.parentElement.parentElement.remove()">Fechar</button>
      </div>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      animation: slideIn 0.3s ease;
    `;

    const updateContent = notification.querySelector('.update-content');
    updateContent.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    `;

    const buttons = notification.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      `;
    });

    // Adicionar CSS para animação
    if (!document.querySelector('#pwa-styles')) {
      const style = document.createElement('style');
      style.id = 'pwa-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto-remover após 10 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  // Verificar se está online/offline
  setupOnlineOfflineDetection() {
    window.addEventListener('online', () => {
      this.showOnlineNotification();
    });

    window.addEventListener('offline', () => {
      this.showOfflineNotification();
    });
  }

  // Notificação de online
  showOnlineNotification() {
    this.showStatusNotification('Conexão restaurada!', '#4CAF50');
  }

  // Notificação de offline
  showOfflineNotification() {
    this.showStatusNotification('Modo offline ativo', '#FF9800');
  }

  // Mostrar notificação de status
  showStatusNotification(message, color) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${color};
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 14px;
      z-index: 1002;
      animation: fadeInOut 3s ease;
    `;
    notification.textContent = message;

    // Adicionar CSS para animação
    if (!document.querySelector('#pwa-status-styles')) {
      const style = document.createElement('style');
      style.id = 'pwa-status-styles';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          20% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }
}

// Inicializar PWA Manager quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  window.pwaManager = new PWAManager();
  window.pwaManager.setupOnlineOfflineDetection();
});

// Verificar se o app está sendo executado em modo standalone (instalado)
if (window.matchMedia('(display-mode: standalone)').matches) {
  document.body.classList.add('pwa-installed');
} 