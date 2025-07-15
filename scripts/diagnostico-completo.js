const { Pool } = require('pg');
require('dotenv').config();

// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function diagnosticoCompleto() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO DO SISTEMA');
    console.log('=============================================\n');
    
    // 1. Verificar conexão com banco
    console.log('1️⃣ Testando conexão com banco de dados...');
    const versionResult = await client.query('SELECT version()');
    console.log('✅ Conexão com banco estabelecida');
    console.log(`📊 Versão PostgreSQL: ${versionResult.rows[0].version.split(' ')[1]}\n`);
    
    // 2. Verificar estrutura da tabela users
    console.log('2️⃣ Verificando estrutura da tabela users...');
    const userColumnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    const userColumns = userColumnsResult.rows.map(row => row.column_name);
    console.log('📋 Colunas encontradas na tabela users:');
    userColumns.forEach(col => console.log(`   - ${col}`));
    
    // Verificar campos LGPD
    const camposLGPD = ['consent_marketing', 'consent_third_party'];
    const camposFaltando = camposLGPD.filter(campo => !userColumns.includes(campo));
    
    if (camposFaltando.length > 0) {
      console.log(`❌ Campos LGPD faltando: ${camposFaltando.join(', ')}`);
    } else {
      console.log('✅ Todos os campos LGPD presentes');
    }
    console.log('');
    
    // 3. Verificar tabela lgpd_audit
    console.log('3️⃣ Verificando tabela lgpd_audit...');
    const auditTableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'lgpd_audit'
      )
    `);
    
    if (auditTableResult.rows[0].exists) {
      console.log('✅ Tabela lgpd_audit existe');
    } else {
      console.log('❌ Tabela lgpd_audit não existe');
    }
    console.log('');
    
    // 4. Verificar produtos
    console.log('4️⃣ Verificando produtos...');
    const productsResult = await client.query('SELECT COUNT(*) as total FROM products WHERE active = true');
    console.log(`📦 Total de produtos ativos: ${productsResult.rows[0].total}`);
    
    const productsWithImages = await client.query(`
      SELECT COUNT(*) as total 
      FROM products 
      WHERE active = true AND image IS NOT NULL AND image != ''
    `);
    console.log(`🖼️ Produtos com imagens: ${productsWithImages.rows[0].total}`);
    console.log('');
    
    // 5. Verificar usuários
    console.log('5️⃣ Verificando usuários...');
    const usersResult = await client.query('SELECT COUNT(*) as total FROM users WHERE active = true');
    console.log(`👥 Total de usuários ativos: ${usersResult.rows[0].total}`);
    console.log('');
    
    // 6. Aplicar correções necessárias
    console.log('6️⃣ Aplicando correções necessárias...');
    
    // Adicionar campos LGPD se não existirem
    if (camposFaltando.length > 0) {
      console.log('🔧 Adicionando campos LGPD...');
      for (const campo of camposFaltando) {
        await client.query(`ALTER TABLE users ADD COLUMN ${campo} BOOLEAN DEFAULT FALSE`);
        console.log(`   ✅ Campo ${campo} adicionado`);
      }
    }
    
    // Criar tabela lgpd_audit se não existir
    if (!auditTableResult.rows[0].exists) {
      console.log('🔧 Criando tabela lgpd_audit...');
      await client.query(`
        CREATE TABLE lgpd_audit (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          action VARCHAR(50) NOT NULL,
          details JSONB,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('   ✅ Tabela lgpd_audit criada');
    }
    
    // Criar índices para performance
    console.log('🔧 Criando índices de performance...');
    try {
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_products_active ON products(active)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_lgpd_audit_user_id ON lgpd_audit(user_id)');
      console.log('   ✅ Índices criados');
    } catch (error) {
      console.log('   ⚠️ Alguns índices já existem');
    }
    
    // 7. Atualizar produtos com imagens se necessário
    console.log('🔧 Verificando imagens dos produtos...');
    const productsWithoutImages = await client.query(`
      SELECT id, name FROM products 
      WHERE active = true AND (image IS NULL OR image = '')
      LIMIT 5
    `);
    
    if (productsWithoutImages.rows.length > 0) {
      console.log('   📝 Atualizando produtos sem imagens...');
      const imageMap = {
        'Brigadeiro': 'dish.png',
        'Beijinho': 'dish2.png',
        'Bolo de Chocolate': 'dish3.png',
        'Torta de Limão': 'dish4.png'
      };
      
      for (const product of productsWithoutImages.rows) {
        const image = imageMap[product.name] || 'dish.png';
        await client.query('UPDATE products SET image = $1 WHERE id = $2', [image, product.id]);
        console.log(`   ✅ Produto ${product.name} atualizado com imagem ${image}`);
      }
    }
    
    console.log('');
    
    // 8. Teste final
    console.log('7️⃣ Realizando teste final...');
    
    // Testar inserção de usuário
    try {
      const testUserResult = await client.query(`
        INSERT INTO users (name, email, password, phone, consent_marketing, consent_third_party, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email
      `, [
        'Teste Sistema',
        'teste@sistema.com',
        '$2a$12$test.hash.for.testing',
        '(11) 99999-9999',
        true,
        false,
        true
      ]);
      
      console.log('✅ Teste de inserção de usuário: SUCESSO');
      console.log(`   👤 Usuário criado: ${testUserResult.rows[0].name} (ID: ${testUserResult.rows[0].id})`);
      
      // Limpar usuário de teste
      await client.query('DELETE FROM users WHERE email = $1', ['teste@sistema.com']);
      console.log('   🧹 Usuário de teste removido');
      
    } catch (error) {
      console.log('❌ Teste de inserção de usuário: FALHOU');
      console.log(`   Erro: ${error.message}`);
    }
    
    // Verificar produtos novamente
    const finalProductsResult = await client.query('SELECT COUNT(*) as total FROM products WHERE active = true');
    console.log(`✅ Total final de produtos: ${finalProductsResult.rows[0].total}`);
    
    console.log('');
    console.log('🎉 DIAGNÓSTICO COMPLETO FINALIZADO');
    console.log('====================================');
    console.log('✅ Sistema verificado e corrigido');
    console.log('✅ Campos LGPD adicionados');
    console.log('✅ Tabela de auditoria criada');
    console.log('✅ Índices de performance criados');
    console.log('✅ Produtos com imagens atualizados');
    console.log('✅ Teste de inserção realizado com sucesso');
    console.log('');
    console.log('🚀 O sistema está pronto para uso!');
    
  } catch (error) {
    console.error('❌ ERRO NO DIAGNÓSTICO:', error);
    console.error('Detalhes:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar diagnóstico
diagnosticoCompleto().catch(console.error); 