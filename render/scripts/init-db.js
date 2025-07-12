const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function initDatabase() {
  try {
    console.log('🚀 Inicializando banco de dados...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../sql/schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Executar o SQL
    await pool.query(sqlContent);
    
    console.log('✅ Banco de dados inicializado com sucesso!');
    
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
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    process.exit(1);
  }
}

initDatabase(); 