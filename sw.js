const CACHE_NAME = 'doce-sensacoes-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/css/styles.css',
  '/src/css/header.css',
  '/src/css/home.css',
  '/src/css/menu.css',
  '/src/css/testimonials.css',
  '/src/css/button.css',
  '/src/css/footer.css',
  '/src/javascript/script.js',
  '/src/javascript/config.js',
  '/src/images/hero.png',
  '/src/images/logo.PNG',
  '/src/images/dish.png',
  '/src/images/dish2.png',
  '/src/images/dish3.png',
  '/src/images/dish4.png',
  '/src/images/chef.png',
  '/src/images/avatar.png',
  '/src/images/wave.svg',
  '/src/pages/cardapio.html',
  '/src/pages/quemsomos.html',
  '/src/pages/login.html',
  '/src/pages/cadastro.html',
  '/src/pages/carrinho.html',
  '/src/pages/perfil.html',
  '/src/pages/detalheproduto.html',
  '/src/pages/admin-cadastro-produto.html',
  '/src/pages/admin-estoque-produtos.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
  'https://unpkg.com/scrollreveal'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna o cache se encontrado
        if (response) {
          return response;
        }

        // Se não estiver em cache, busca na rede
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para poder usá-la no cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback para páginas offline
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Aqui você pode implementar sincronização de dados
  // Por exemplo, enviar pedidos offline quando a conexão voltar
  console.log('Sincronização em background executada');
}

// Notificações push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Novo pedido disponível!',
    icon: '/src/images/icon-192x192.png',
    badge: '/src/images/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver pedido',
        icon: '/src/images/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/src/images/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Doce Sensações', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/src/pages/cardapio.html')
    );
  }
}); 