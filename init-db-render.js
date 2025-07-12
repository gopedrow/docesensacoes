require('dotenv').config();
const pool = require('./config/database');

async function initDatabase() {
  try {
    console.log('🚀 Inicializando banco de dados no Render...');
    
    // Criar tabelas
    const createTablesSQL = `
      -- Tabela de usuários
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        active BOOLEAN DEFAULT true
      );

      -- Tabela de produtos
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50),
        image VARCHAR(255),
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        active BOOLEAN DEFAULT true
      );

      -- Tabela de pedidos
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Tabela de itens do pedido
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL
      );

      -- Tabela de avaliações
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(createTablesSQL);
    console.log('✅ Tabelas criadas com sucesso!');
    
    // Criar usuário admin padrão
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(`
      INSERT INTO users (name, email, password, phone, is_admin, created_at, active)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6)
      ON CONFLICT (email) DO NOTHING
    `, ['Admin', 'admin@docesensacoes.com', hashedPassword, '(11) 99999-9999', true, true]);
    
    console.log('✅ Usuário admin criado: admin@docesensacoes.com / admin123');
    
    // Criar alguns produtos de exemplo
    await pool.query(`
      INSERT INTO products (name, description, price, category, image, created_at, active)
      VALUES 
        ('Brigadeiro', 'Delicioso brigadeiro caseiro feito com chocolate belga', 5.00, 'Doces', 'dish.png', NOW(), true),
        ('Beijinho', 'Beijinho tradicional com coco ralado', 4.50, 'Doces', 'dish2.png', NOW(), true),
        ('Bolo de Chocolate', 'Bolo caseiro de chocolate com cobertura', 25.00, 'Bolos', 'dish3.png', NOW(), true),
        ('Torta de Limão', 'Torta refrescante de limão', 18.00, 'Tortas', 'dish4.png', NOW(), true)
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ Produtos de exemplo criados!');
    
    console.log('🎉 Banco de dados inicializado com sucesso no Render!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    process.exit(1);
  }
}

initDatabase(); 