const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuração do banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initDatabase() {
  try {
    console.log('🚀 Iniciando inicialização do banco de dados...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../sql/schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Executar o SQL
    await pool.query(sqlContent);
    
    console.log('✅ Banco de dados inicializado com sucesso!');
    console.log('📋 Tabelas criadas:');
    console.log('   - users (usuários)');
    console.log('   - products (produtos)');
    console.log('   - orders (pedidos)');
    console.log('   - order_items (itens dos pedidos)');
    console.log('   - reviews (avaliações)');
    console.log('');
    console.log('👤 Usuário admin criado:');
    console.log('   Email: admin@docesensacoes.com');
    console.log('   Senha: admin123');
    console.log('');
    console.log('🍰 Produtos de exemplo inseridos');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🎉 Inicialização concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Falha na inicialização:', error);
      process.exit(1);
    });
}

module.exports = initDatabase; 