const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const initDatabase = require('./scripts/init-database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests por IP
});
app.use(limiter);

// CORS configurado corretamente
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5000', 
    'http://localhost:8000', 
    'https://docesensacoes.onrender.com', 
    'https://docesensacoessite.vercel.app',
    'https://docesensacoes.com.br',
    'https://www.docesensacoes.com.br',
    'https://docesensacoes.com',
    'https://www.docesensacoes.com',
    'https://docesensacoes.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Importar rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({
    status: 200,
    message: 'API Doce Sensações funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota para inicializar banco de dados
app.post('/api/init-database', async (req, res) => {
  try {
    console.log('🚀 Inicializando banco de dados via API...');
    await initDatabase();
    res.json({
      status: 200,
      message: 'Banco de dados inicializado com sucesso!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro ao inicializar banco de dados',
      message: error.message
    });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API Doce Sensações!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      reviews: '/api/reviews',
      init: '/api/init-database'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Inicializar banco de dados automaticamente na primeira execução
let dbInitialized = false;

async function initializeDatabaseOnStartup() {
  if (!dbInitialized) {
    try {
      console.log('🔄 Verificando inicialização do banco de dados...');
      await initDatabase();
      dbInitialized = true;
      console.log('✅ Banco de dados inicializado automaticamente!');
    } catch (error) {
      console.log('⚠️ Banco já inicializado ou erro na inicialização automática:', error.message);
    }
  }
}

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  
  // Inicializar banco após 5 segundos
  setTimeout(initializeDatabaseOnStartup, 5000);
});

module.exports = app; 