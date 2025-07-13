const pool = require('../config/database');

async function updateProductionDatabase() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 Iniciando atualização do banco de dados de produção para LGPD...');
        
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
            SET image = CASE 
                WHEN name LIKE '%Bolo%' THEN 'dish3.png'
                WHEN name LIKE '%Brigadeiro%' THEN 'dish.png'
                WHEN name LIKE '%Torta%' THEN 'dish4.png'
                WHEN name LIKE '%Beijinho%' THEN 'dish2.png'
                ELSE image
            END
            WHERE image IS NULL OR image = ''
        `);
        
        console.log('✅ Produtos atualizados com imagens');
        
        // Inserir produtos adicionais se não existirem
        await client.query(`
            INSERT INTO products (name, description, price, category, stock, active, image) 
            VALUES 
                ('Cupcake Red Velvet', 'Cupcake macio com massa de red velvet e cobertura de cream cheese suave', 7.00, 'Doces', 25, true, 'dish2.png'),
                ('Alfajor Argentino', 'Alfajor recheado com doce de leite artesanal e coberto com chocolate belga', 6.00, 'Doces', 15, true, 'dish3.png'),
                ('Torta de Chocolate', 'Torta de chocolate com recheio cremoso e cobertura de ganache', 25.00, 'Tortas', 8, true, 'dish4.png')
            ON CONFLICT DO NOTHING
        `);
        
        console.log('✅ Produtos adicionais inseridos');
        
        console.log('🎉 Atualização do banco de dados de produção concluída com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro durante a atualização:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    updateProductionDatabase()
        .then(() => {
            console.log('✅ Script de produção executado com sucesso');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro na execução do script de produção:', error);
            process.exit(1);
        });
}

module.exports = { updateProductionDatabase }; 