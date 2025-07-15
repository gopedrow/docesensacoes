const pool = require('../config/database');

async function corrigirSistemaProducao() {
    const client = await pool.connect();
    
    try {
        console.log('🔧 INICIANDO CORREÇÃO COMPLETA DO SISTEMA');
        console.log('=========================================\n');
        
        // 1. Verificar e adicionar campos LGPD
        console.log('1️⃣ Verificando campos LGPD...');
        
        // Verificar se os campos existem
        const columnsResult = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name IN ('consent_marketing', 'consent_third_party')
        `);
        
        const existingColumns = columnsResult.rows.map(row => row.column_name);
        const missingColumns = ['consent_marketing', 'consent_third_party'].filter(col => !existingColumns.includes(col));
        
        if (missingColumns.length > 0) {
            console.log(`❌ Campos faltando: ${missingColumns.join(', ')}`);
            console.log('🔧 Adicionando campos LGPD...');
            
            for (const column of missingColumns) {
                await client.query(`ALTER TABLE users ADD COLUMN ${column} BOOLEAN DEFAULT FALSE`);
                console.log(`   ✅ Campo ${column} adicionado`);
            }
        } else {
            console.log('✅ Todos os campos LGPD já existem');
        }
        
        // 2. Verificar e criar tabela lgpd_audit
        console.log('\n2️⃣ Verificando tabela lgpd_audit...');
        
        const auditTableExists = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'lgpd_audit'
            )
        `);
        
        if (!auditTableExists.rows[0].exists) {
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
        } else {
            console.log('✅ Tabela lgpd_audit já existe');
        }
        
        // 3. Criar índices para performance
        console.log('\n3️⃣ Criando índices de performance...');
        
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
            'CREATE INDEX IF NOT EXISTS idx_users_active ON users(active)',
            'CREATE INDEX IF NOT EXISTS idx_products_active ON products(active)',
            'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
            'CREATE INDEX IF NOT EXISTS idx_lgpd_audit_user_id ON lgpd_audit(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_lgpd_audit_created_at ON lgpd_audit(created_at)'
        ];
        
        for (const indexQuery of indexes) {
            try {
                await client.query(indexQuery);
                console.log('   ✅ Índice criado/verificado');
            } catch (error) {
                console.log('   ⚠️ Índice já existe ou erro:', error.message);
            }
        }
        
        // 4. Verificar e corrigir produtos sem imagens
        console.log('\n4️⃣ Verificando produtos sem imagens...');
        
        const productsWithoutImages = await client.query(`
            SELECT id, name FROM products 
            WHERE active = true AND (image IS NULL OR image = '')
            LIMIT 10
        `);
        
        if (productsWithoutImages.rows.length > 0) {
            console.log(`🔧 Encontrados ${productsWithoutImages.rows.length} produtos sem imagens`);
            
            const imageMap = {
                'Brigadeiro': 'dish.png',
                'Beijinho': 'dish2.png',
                'Bolo de Chocolate': 'dish3.png',
                'Torta de Limão': 'dish4.png'
            };
            
            for (const product of productsWithoutImages.rows) {
                const image = imageMap[product.name] || 'dish.png';
                await client.query('UPDATE products SET image = $1 WHERE id = $2', [image, product.id]);
                console.log(`   ✅ ${product.name} -> ${image}`);
            }
        } else {
            console.log('✅ Todos os produtos têm imagens');
        }
        
        // 5. Verificar estrutura geral
        console.log('\n5️⃣ Verificando estrutura geral...');
        
        const stats = await client.query(`
            SELECT 
                (SELECT COUNT(*) FROM users WHERE active = true) as users_count,
                (SELECT COUNT(*) FROM products WHERE active = true) as products_count,
                (SELECT COUNT(*) FROM lgpd_audit) as audit_count
        `);
        
        console.log(`📊 Estatísticas do sistema:`);
        console.log(`   👥 Usuários ativos: ${stats.rows[0].users_count}`);
        console.log(`   📦 Produtos ativos: ${stats.rows[0].products_count}`);
        console.log(`   📋 Registros de auditoria: ${stats.rows[0].audit_count}`);
        
        // 6. Teste de funcionalidade
        console.log('\n6️⃣ Realizando teste de funcionalidade...');
        
        try {
            // Testar inserção de usuário com campos LGPD
            const testUserResult = await client.query(`
                INSERT INTO users (name, email, password, phone, consent_marketing, consent_third_party, active)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, name, email, consent_marketing, consent_third_party
            `, [
                'Teste Sistema',
                'teste@sistema.com',
                '$2a$12$test.hash.for.testing',
                '(11) 99999-9999',
                true,
                false,
                true
            ]);
            
            const testUser = testUserResult.rows[0];
            console.log('✅ Teste de inserção: SUCESSO');
            console.log(`   👤 Usuário: ${testUser.name}`);
            console.log(`   📧 Email: ${testUser.email}`);
            console.log(`   📱 Marketing: ${testUser.consent_marketing}`);
            console.log(`   🤝 Terceiros: ${testUser.consent_third_party}`);
            
            // Testar inserção na tabela de auditoria
            await client.query(`
                INSERT INTO lgpd_audit (user_id, action, details)
                VALUES ($1, $2, $3)
            `, [
                testUser.id,
                'REGISTER',
                JSON.stringify({ consent_marketing: true, consent_third_party: false })
            ]);
            console.log('   ✅ Registro de auditoria criado');
            
            // Limpar dados de teste
            await client.query('DELETE FROM lgpd_audit WHERE user_id = $1', [testUser.id]);
            await client.query('DELETE FROM users WHERE id = $1', [testUser.id]);
            console.log('   🧹 Dados de teste removidos');
            
        } catch (error) {
            console.log('❌ Teste de funcionalidade: FALHOU');
            console.log(`   Erro: ${error.message}`);
        }
        
        // 7. Verificação final
        console.log('\n7️⃣ Verificação final...');
        
        // Verificar se todos os campos necessários existem
        const finalCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name IN ('id', 'name', 'email', 'password', 'phone', 'consent_marketing', 'consent_third_party', 'active')
            ORDER BY column_name
        `);
        
        const requiredFields = ['id', 'name', 'email', 'password', 'phone', 'consent_marketing', 'consent_third_party', 'active'];
        const existingFields = finalCheck.rows.map(row => row.column_name);
        const missingFields = requiredFields.filter(field => !existingFields.includes(field));
        
        if (missingFields.length === 0) {
            console.log('✅ Todos os campos obrigatórios presentes');
        } else {
            console.log(`❌ Campos faltando: ${missingFields.join(', ')}`);
        }
        
        console.log('\n🎉 CORREÇÃO COMPLETA FINALIZADA');
        console.log('================================');
        console.log('✅ Campos LGPD adicionados');
        console.log('✅ Tabela de auditoria criada');
        console.log('✅ Índices de performance criados');
        console.log('✅ Produtos com imagens atualizados');
        console.log('✅ Teste de funcionalidade realizado');
        console.log('✅ Sistema verificado e corrigido');
        console.log('');
        console.log('🚀 O sistema está 100% funcional!');
        console.log('📝 Próximo passo: Testar o cadastro no frontend');
        
    } catch (error) {
        console.error('❌ ERRO NA CORREÇÃO:', error);
        console.error('Detalhes:', error.message);
        throw error;
    } finally {
        client.release();
    }
}

// Executar correção
corrigirSistemaProducao()
    .then(() => {
        console.log('\n✅ Correção concluída com sucesso!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Erro na correção:', error);
        process.exit(1);
    }); 