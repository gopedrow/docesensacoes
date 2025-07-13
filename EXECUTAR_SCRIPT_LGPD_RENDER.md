# Executar Script LGPD no Render

## Instruções para Atualizar o Banco de Dados de Produção

### 1. Acessar o Console do Render

1. Faça login no [Render Dashboard](https://dashboard.render.com)
2. Navegue até o serviço `docesensacoes-2`
3. Clique na aba "Shell"

### 2. Executar o Script de Atualização

No console do Render, execute os seguintes comandos:

```bash
# Navegar para o diretório do projeto
cd /opt/render/project/src

# Executar o script de atualização LGPD
node render/scripts/update-lgpd-production.js
```

### 3. Verificar a Execução

O script deve mostrar as seguintes mensagens:

```
🔄 Iniciando atualização do banco de dados de produção para LGPD...
✅ Colunas de consentimento adicionadas
✅ Tabela de auditoria LGPD criada
✅ Índices criados
✅ Produtos atualizados com imagens
✅ Produtos adicionais inseridos
🎉 Atualização do banco de dados de produção concluída com sucesso!
✅ Script de produção executado com sucesso
```

### 4. Testar as Funcionalidades

Após a execução, teste:

1. **Cadastro de Usuário**: Acesse a página de cadastro e verifique se os campos de consentimento aparecem
2. **API de Registro**: Teste o endpoint `/api/auth/register` com os novos campos
3. **Cardápio**: Verifique se os produtos estão sendo exibidos corretamente

### 5. Comandos de Teste

```bash
# Testar API de produtos
curl -s "https://docesensacoes-2.onrender.com/api/products" | head -20

# Testar cadastro com LGPD
curl -X POST "https://docesensacoes-2.onrender.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste LGPD",
    "email": "teste@lgpd.com",
    "phone": "(11) 99999-9999",
    "password": "Senha123!",
    "consent_privacy": true,
    "consent_marketing": false,
    "consent_third_party": false
  }'
```

### 6. Solução de Problemas

Se houver erros:

1. **Erro de conexão**: Verifique se a variável `DATABASE_URL` está configurada
2. **Erro de permissão**: Verifique se o usuário do banco tem permissões adequadas
3. **Erro de sintaxe**: Verifique se o script está no diretório correto

### 7. Logs de Execução

Para ver os logs detalhados:

```bash
# Ver logs do serviço
tail -f /opt/render/logs/app.log

# Ver logs específicos do banco
grep "database" /opt/render/logs/app.log
```

### 8. Rollback (se necessário)

Se algo der errado, você pode reverter as mudanças:

```sql
-- Remover colunas de consentimento
ALTER TABLE users DROP COLUMN IF EXISTS consent_marketing;
ALTER TABLE users DROP COLUMN IF EXISTS consent_third_party;

-- Remover tabela de auditoria
DROP TABLE IF EXISTS lgpd_audit;
```

---

**Importante**: Execute este script apenas uma vez. O script usa `IF NOT EXISTS` e `ON CONFLICT DO NOTHING` para evitar duplicações. 