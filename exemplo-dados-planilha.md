# Exemplo de Dados para a Planilha

## Estrutura da Planilha

Crie uma planilha com o ID: `1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso`

### Aba "Produtos"

| ID | Nome | Descrição | Preço | Categoria | Imagem | Ativo |
|----|------|-----------|-------|-----------|--------|-------|
| 1 | Brigadeiro | Delicioso brigadeiro caseiro feito com chocolate belga | 5.00 | Doces | dish.png | TRUE |
| 2 | Beijinho | Beijinho tradicional com coco ralado | 4.50 | Doces | dish2.png | TRUE |
| 3 | Bolo de Chocolate | Bolo caseiro de chocolate com cobertura | 25.00 | Bolos | dish3.png | TRUE |
| 4 | Torta de Limão | Torta refrescante de limão | 18.00 | Tortas | dish4.png | TRUE |
| 5 | Cupcake de Baunilha | Cupcake fofinho de baunilha | 8.00 | Cupcakes | dish.png | TRUE |

### Aba "Usuarios"

| ID | Nome | Email | Telefone | Endereco | DataCadastro |
|----|------|-------|----------|----------|--------------|
| 1 | João Silva | joao@email.com | (11) 99999-9999 | Rua A, 123 | 2024-01-01T00:00:00.000Z |

### Aba "Pedidos"

| ID | UsuarioId | Produtos | Total | Status | Data |
|----|-----------|----------|-------|--------|------|
| 1 | 1 | [{"id":"1","nome":"Brigadeiro","preco":5.00,"quantidade":2}] | 10.00 | Pendente | 2024-01-01T00:00:00.000Z |

### Aba "Avaliacoes"

| ID | ProdutoId | UsuarioId | Nota | Comentario | Data |
|----|-----------|-----------|------|------------|------|
| 1 | 1 | 1 | 5 | Muito bom! | 2024-01-01T00:00:00.000Z |

## Como Configurar

1. **Acesse sua planilha**: https://docs.google.com/spreadsheets/d/1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso/edit

2. **Crie as abas**:
   - Clique no "+" no final das abas
   - Renomeie para: "Produtos", "Usuarios", "Pedidos", "Avaliacoes"

3. **Adicione os cabeçalhos** conforme a tabela acima

4. **Adicione alguns produtos de teste** na aba "Produtos"

5. **Configure as permissões**:
   - Clique em "Compartilhar" no canto superior direito
   - Adicione o email do Google Apps Script como editor

## Notas Importantes

- **ID**: Deve ser único para cada produto
- **Ativo**: Use "TRUE" ou "FALSE" (ou TRUE/FALSE sem aspas)
- **Preço**: Use números (ex: 5.00, não "R$ 5,00")
- **Imagem**: Nome do arquivo na pasta images (ex: dish.png)
- **Data**: Formato ISO (será gerado automaticamente pelo script) 