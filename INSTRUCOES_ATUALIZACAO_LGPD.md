# Instruções para Atualização LGPD e Produtos

## 🔄 Atualização do Banco de Dados

### 1. Executar Script de Atualização

Para aplicar as melhorias LGPD e corrigir os produtos, execute o script de atualização no ambiente de produção:

```bash
# No servidor Render ou ambiente de produção
node scripts/update-database-lgpd.js
```

### 2. Verificar Variáveis de Ambiente

Certifique-se de que a variável `DATABASE_URL` está configurada corretamente:

```bash
# Verificar se a variável está definida
echo $DATABASE_URL

# Ou definir manualmente (se necessário)
export DATABASE_URL="postgresql://usuario:senha@host:porta/banco"
```

### 3. Executar Manualmente no Banco

Se preferir executar manualmente, use estas queries SQL:

```sql
-- Adicionar colunas de consentimento
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS consent_third_party BOOLEAN DEFAULT FALSE;

-- Criar tabela de auditoria LGPD
CREATE TABLE IF NOT EXISTS lgpd_audit (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_users_consent_marketing ON users(consent_marketing);
CREATE INDEX IF NOT EXISTS idx_users_consent_third_party ON users(consent_third_party);
CREATE INDEX IF NOT EXISTS idx_lgpd_audit_user_id ON lgpd_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_lgpd_audit_created_at ON lgpd_audit(created_at);

-- Atualizar produtos com imagens
UPDATE products 
SET image_url = CASE 
    WHEN name LIKE '%Bolo%' THEN 'dish4.png'
    WHEN name LIKE '%Trufa%' OR name LIKE '%Brigadeiro%' THEN 'dish.png'
    WHEN name LIKE '%Torta%' THEN 'dish2.png'
    WHEN name LIKE '%Cookie%' OR name LIKE '%Alfajor%' THEN 'dish3.png'
    ELSE image_url
END
WHERE image_url IS NULL OR image_url = '';

-- Inserir produtos adicionais
INSERT INTO products (name, description, price, category, stock_quantity, status, image_url) 
VALUES 
    ('Cupcake Red Velvet', 'Cupcake macio com massa de red velvet e cobertura de cream cheese suave', 7.00, 'Doce/Bolo', 25, 'ativo', 'dish2.png'),
    ('Alfajor Argentino', 'Alfajor recheado com doce de leite artesanal e coberto com chocolate belga', 6.00, 'Doce/Biscoito', 15, 'ativo', 'dish3.png'),
    ('Torta de Chocolate', 'Torta de chocolate com recheio cremoso e cobertura de ganache', 25.00, 'Doce/Torta', 8, 'ativo', 'dish4.png')
ON CONFLICT DO NOTHING;
```

## 🚀 Deploy das Atualizações

### 1. Frontend (Páginas HTML)

As seguintes páginas foram atualizadas e devem ser enviadas para o servidor:

- ✅ `src/pages/cadastro.html` - Formulário LGPD otimizado
- ✅ `src/pages/cardapio.html` - Exibição dinâmica de produtos
- ✅ `src/javascript/config.js` - Endpoint corrigido

### 2. Backend (API)

As seguintes rotas foram atualizadas:

- ✅ `routes/auth.js` - Validações LGPD e novas rotas
- ✅ `render/sql/schema.sql` - Schema atualizado

### 3. Scripts

- ✅ `scripts/update-database-lgpd.js` - Script de atualização

## 🧪 Testes Recomendados

### 1. Teste de Cadastro

1. Acesse a página de cadastro
2. Teste validações de senha fraca
3. Teste formato de telefone inválido
4. Teste email duplicado
5. Verifique consentimentos obrigatórios
6. Teste cadastro completo

### 2. Teste de Produtos

1. Acesse a página do cardápio
2. Verifique se os produtos carregam
3. Teste adicionar ao carrinho
4. Verifique imagens dos produtos
5. Teste produtos sem estoque

### 3. Teste de API

```bash
# Teste de registro
curl -X POST https://docesensacoes-2.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Usuario",
    "email": "teste@exemplo.com",
    "password": "Senha123!",
    "phone": "(11) 99999-9999",
    "consentMarketing": true,
    "consentThirdParty": false
  }'

# Teste de produtos
curl https://docesensacoes-2.onrender.com/api/products
```

## 📊 Verificação de Sucesso

### 1. Banco de Dados

Verifique se as colunas foram criadas:

```sql
-- Verificar colunas de consentimento
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('consent_marketing', 'consent_third_party');

-- Verificar tabela de auditoria
SELECT COUNT(*) FROM lgpd_audit;

-- Verificar produtos
SELECT COUNT(*) FROM products WHERE image_url IS NOT NULL;
```

### 2. Frontend

- ✅ Formulário de cadastro com validações
- ✅ Indicador de força de senha
- ✅ Consentimentos obrigatórios
- ✅ Produtos carregando no cardápio
- ✅ Imagens exibidas corretamente

### 3. Backend

- ✅ Rotas de registro funcionando
- ✅ Validações de senha
- ✅ Logs de auditoria
- ✅ Tratamento de erros

## 🔧 Troubleshooting

### Problema: Produtos não carregam

**Solução:**
1. Verificar console do navegador
2. Verificar se a API está respondendo
3. Verificar estrutura da resposta
4. Verificar mapeamento de campos

### Problema: Cadastro não funciona

**Solução:**
1. Verificar endpoint `/auth/register`
2. Verificar validações no backend
3. Verificar campos obrigatórios
4. Verificar logs de erro

### Problema: Imagens não aparecem

**Solução:**
1. Verificar caminho das imagens
2. Verificar se arquivos existem em `src/images/`
3. Verificar campo `image_url` no banco
4. Verificar fallback de imagens

## 📞 Suporte

Em caso de problemas:

1. Verificar logs do servidor
2. Verificar console do navegador
3. Testar endpoints individualmente
4. Verificar conectividade com banco

---

**Status**: ✅ Pronto para Deploy  
**Última Atualização**: Dezembro 2024 