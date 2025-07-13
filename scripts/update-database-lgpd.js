const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost/docesensacoes',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function updateDatabase() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 Iniciando atualização do banco de dados para LGPD...');
        
        // Adicionar colunas de consentimento se não existirem
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS consent_third_party BOOLEAN DEFAULT FALSE
        `);
        
        console.log('✅ Colunas de consentimento adicionadas');
        
        // Criar tabela de auditoria LGPD se não existir
        await client.query(`
            CREATE TABLE IF NOT EXISTS lgpd_audit (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                action VARCHAR(100) NOT NULL,
                details TEXT,
                ip_address INET,
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('✅ Tabela de auditoria LGPD criada');
        
        // Criar índices se não existirem
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_consent_marketing ON users(consent_marketing);
            CREATE INDEX IF NOT EXISTS idx_users_consent_third_party ON users(consent_third_party);
            CREATE INDEX IF NOT EXISTS idx_lgpd_audit_user_id ON lgpd_audit(user_id);
            CREATE INDEX IF NOT EXISTS idx_lgpd_audit_created_at ON lgpd_audit(created_at);
        `);
        
        console.log('✅ Índices criados');
        
        // Atualizar produtos com imagens se necessário
        await client.query(`
            UPDATE products 
            SET image_url = CASE 
                WHEN name LIKE '%Bolo%' THEN 'dish4.png'
                WHEN name LIKE '%Trufa%' OR name LIKE '%Brigadeiro%' THEN 'dish.png'
                WHEN name LIKE '%Torta%' THEN 'dish2.png'
                WHEN name LIKE '%Cookie%' OR name LIKE '%Alfajor%' THEN 'dish3.png'
                ELSE image_url
            END
            WHERE image_url IS NULL OR image_url = ''
        `);
        
        console.log('✅ Produtos atualizados com imagens');
        
        // Inserir produtos adicionais se não existirem
        await client.query(`
            INSERT INTO products (name, description, price, category, stock_quantity, status, image_url) 
            VALUES 
                ('Cupcake Red Velvet', 'Cupcake macio com massa de red velvet e cobertura de cream cheese suave', 7.00, 'Doce/Bolo', 25, 'ativo', 'dish2.png'),
                ('Alfajor Argentino', 'Alfajor recheado com doce de leite artesanal e coberto com chocolate belga', 6.00, 'Doce/Biscoito', 15, 'ativo', 'dish3.png'),
                ('Torta de Chocolate', 'Torta de chocolate com recheio cremoso e cobertura de ganache', 25.00, 'Doce/Torta', 8, 'ativo', 'dish4.png')
            ON CONFLICT DO NOTHING
        `);
        
        console.log('✅ Produtos adicionais inseridos');
        
        console.log('🎉 Atualização do banco de dados concluída com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro durante a atualização:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    updateDatabase()
        .then(() => {
            console.log('✅ Script executado com sucesso');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro na execução do script:', error);
            process.exit(1);
        });
}

module.exports = { updateDatabase }; 