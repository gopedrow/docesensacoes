-- Script para corrigir o problema da coluna "endereço"
-- Execute este script no PostgreSQL do Render

-- 1. Verificar tabelas existentes
\dt

-- 2. Verificar se existe tabela 'usuários' ou 'users'
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('usuários', 'users', 'usuario');

-- 3. Verificar estrutura da tabela de usuários (se existir)
-- Se a tabela for 'usuários':
\d usuários;

-- Se a tabela for 'users':
\d users;

-- 4. Verificar colunas existentes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('usuários', 'users')
ORDER BY ordinal_position;

-- 5. Adicionar coluna 'endereço' se a tabela for 'usuários' e a coluna não existir
DO $$
BEGIN
    -- Verificar se a tabela 'usuários' existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usuários') THEN
        -- Verificar se a coluna 'endereço' não existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'usuários' AND column_name = 'endereço'
        ) THEN
            -- Adicionar a coluna 'endereço'
            ALTER TABLE usuários ADD COLUMN endereço TEXT;
            RAISE NOTICE 'Coluna "endereço" adicionada à tabela "usuários"';
        ELSE
            RAISE NOTICE 'Coluna "endereço" já existe na tabela "usuários"';
        END IF;
    ELSE
        RAISE NOTICE 'Tabela "usuários" não encontrada';
    END IF;
    
    -- Verificar se a tabela 'users' existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Verificar se a coluna 'address' não existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'address'
        ) THEN
            -- Adicionar a coluna 'address'
            ALTER TABLE users ADD COLUMN address TEXT;
            RAISE NOTICE 'Coluna "address" adicionada à tabela "users"';
        ELSE
            RAISE NOTICE 'Coluna "address" já existe na tabela "users"';
        END IF;
    ELSE
        RAISE NOTICE 'Tabela "users" não encontrada';
    END IF;
END $$;

-- 6. Verificar estrutura final
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('usuários', 'users')
ORDER BY table_name, ordinal_position;

-- 7. Criar tabela 'users' se não existir (schema padrão em inglês)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);

-- 9. Inserir usuário admin se não existir
INSERT INTO users (name, email, password, phone, address, is_admin, active) 
VALUES (
    'Administrador',
    'admin@docesensacoes.com',
    '$2a$10$GR7LniYBqMtZNba0JJ6G4OtZ4XyTgalrvKWCArOr09D3HQNVhUMSq',
    '(11) 99999-9999',
    'Endereço Admin',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- 10. Verificar se o usuário admin foi criado
SELECT id, name, email, is_admin, active FROM users WHERE email = 'admin@docesensacoes.com';

-- 11. Mostrar estrutura final das tabelas
\dt

-- 12. Mostrar estrutura da tabela users
\d users; 