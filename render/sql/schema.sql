-- Schema do banco de dados Doce Sensações

-- Tabela de usuários
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

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ativo',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    delivery_address TEXT,
    delivery_phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- Inserir usuário admin padrão (senha: admin123)
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

-- Inserir alguns produtos de exemplo
INSERT INTO products (name, description, price, category, stock_quantity, status) VALUES
('Bolo de Chocolate', 'Delicioso bolo de chocolate com cobertura', 45.90, 'Doce/Bolo', 10, 'ativo'),
('Trufa de Morango', 'Trufa artesanal de morango', 8.50, 'Doce/Trufa', 20, 'ativo'),
('Brigadeiro Gourmet', 'Brigadeiro tradicional com chocolate belga', 3.50, 'Doce/Recheado', 50, 'ativo'),
('Torta de Limão', 'Torta refrescante de limão', 35.00, 'Doce/Torta', 5, 'ativo'),
('Cookie de Chocolate', 'Cookie crocante com gotas de chocolate', 2.50, 'Doce/Biscoito', 30, 'ativo')
ON CONFLICT DO NOTHING; 