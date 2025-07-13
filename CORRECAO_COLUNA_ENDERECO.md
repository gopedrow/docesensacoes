# 🔧 Correção do Problema da Coluna "endereço"

## 🚨 Problema Identificado

```
erro: coluna "endereço" da relação "usuários" não existe
```

## 📋 Análise do Problema

### **Causa:**
- O banco de dados foi criado com nomes de tabelas/colunas em **português**
- O código está tentando inserir na coluna `endereço` da tabela `usuários`
- Mas o schema atual usa nomes em **inglês** (`address` na tabela `users`)

### **Inconsistência:**
- **Schema atual:** `users` com coluna `address`
- **Banco real:** `usuários` com coluna `endereço` (ou não existe)

## 🛠️ Soluções

### **Opção 1: Corrigir o Schema (Recomendada)**

Atualizar o schema para usar nomes em português:

```sql
-- Schema corrigido com nomes em português
CREATE TABLE IF NOT EXISTS usuários (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereço TEXT,
    é_admin BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Opção 2: Corrigir o Código**

Atualizar o código para usar nomes em inglês:

```javascript
// Código corrigido para usar nomes em inglês
const result = await pool.query(
  `INSERT INTO users (name, email, password, phone, address, created_at, active)
   VALUES ($1, $2, $3, $4, $5, NOW(), true)
   RETURNING id, name, email, phone, address, created_at`,
  [name, email, hashedPassword, phone, address || '']
);
```

### **Opção 3: Verificar e Corrigir o Banco**

Verificar qual é a estrutura real do banco:

```sql
-- Verificar tabelas existentes
\dt

-- Verificar colunas da tabela de usuários
\d usuários;
-- ou
\d users;

-- Verificar estrutura real
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('usuários', 'users');
```

## 🎯 Solução Imediata

### **Passo 1: Verificar Estrutura Real do Banco**

Execute no PostgreSQL do Render:

```sql
-- Verificar tabelas
\dt

-- Verificar colunas da tabela de usuários
\d usuários;
```

### **Passo 2: Corrigir o Schema**

Se a tabela for `usuários` em português:

```sql
-- Adicionar coluna endereço se não existir
ALTER TABLE usuários ADD COLUMN IF NOT EXISTS endereço TEXT;

-- Verificar se a coluna foi criada
\d usuários;
```

### **Passo 3: Corrigir o Código**

Atualizar a rota de registro para usar os nomes corretos:

```javascript
// Se a tabela for 'usuários' em português
const result = await pool.query(
  `INSERT INTO usuários (nome, email, senha, telefone, endereço, criado_em, ativo)
   VALUES ($1, $2, $3, $4, $5, NOW(), true)
   RETURNING id, nome, email, telefone, endereço, criado_em`,
  [name, email, hashedPassword, phone, address || '']
);
```

## 🔍 Diagnóstico Rápido

### **Teste 1: Verificar Estrutura do Banco**
```sql
-- No PostgreSQL do Render
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name LIKE '%user%' OR table_name LIKE '%usuário%';
```

### **Teste 2: Verificar Se a Coluna Existe**
```sql
-- Se a tabela for 'usuários'
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'usuários';

-- Se a tabela for 'users'
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users';
```

## ✅ Checklist de Correção

- [ ] ✅ Verificar estrutura real do banco
- [ ] ✅ Identificar nomes corretos das tabelas/colunas
- [ ] ✅ Corrigir schema se necessário
- [ ] ✅ Corrigir código para usar nomes corretos
- [ ] ✅ Testar cadastro novamente

## 🚀 Próximos Passos

1. **Verificar estrutura real do banco no Render**
2. **Corrigir schema ou código conforme necessário**
3. **Fazer deploy manual no Render**
4. **Testar cadastro novamente**

## 💡 Dica

O problema mais comum é a inconsistência entre:
- **Schema planejado:** `users` com `address`
- **Banco real:** `usuários` com `endereço`

**Verifique primeiro qual é a estrutura real do banco antes de corrigir!** 