# Adicionar Dados de Teste para Login

## Problema Identificado
O sistema não consegue fazer login porque não há usuários cadastrados no Google Sheets.

## Solução: Adicionar Usuário de Teste

### 1. Acesse sua Planilha
- Vá para: https://docs.google.com/spreadsheets/d/1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso/edit

### 2. Verifique a Aba "Usuarios"
- Se não existir, crie uma nova aba chamada "Usuarios"
- Adicione os cabeçalhos na primeira linha:
  ```
  ID | Nome | Email | Telefone | Endereco | DataCadastro
  ```

### 3. Adicione Usuário de Teste
Na aba "Usuarios", adicione uma linha com os seguintes dados:

| ID | Nome | Email | Telefone | Endereco | DataCadastro |
|----|------|-------|----------|----------|--------------|
| 1 | Usuário Teste | teste@email.com | (11) 99999-9999 | Rua Teste, 123 | 2024-01-01T00:00:00.000Z |

### 4. Dados para Teste de Login
Use estes dados no formulário de login:
- **Email**: `teste@email.com`
- **Telefone**: `(11) 99999-9999`

### 5. Verificar Estrutura da Planilha
Certifique-se de que sua planilha tem pelo menos estas abas:
- ✅ **Produtos** (com alguns produtos)
- ✅ **Usuarios** (com o usuário de teste)
- ✅ **Pedidos** (pode estar vazia)
- ✅ **Avaliacoes** (pode estar vazia)

### 6. Testar o Login
1. Abra o arquivo `index.html` no navegador
2. Clique em "Entrar"
3. Use os dados:
   - Email: `teste@email.com`
   - Telefone: `(11) 99999-9999`
4. Clique em "Entrar"

## Dados Alternativos para Teste

Se quiser criar mais usuários de teste, adicione estas linhas na aba "Usuarios":

| ID | Nome | Email | Telefone | Endereco | DataCadastro |
|----|------|-------|----------|----------|--------------|
| 2 | Maria Silva | maria@email.com | (11) 88888-8888 | Rua B, 456 | 2024-01-01T00:00:00.000Z |
| 3 | Pedro Santos | pedro@email.com | (11) 77777-7777 | Rua C, 789 | 2024-01-01T00:00:00.000Z |

## Verificação Rápida

Para verificar se os dados estão corretos:

1. **Aba Usuarios deve ter**:
   - Cabeçalhos na primeira linha
   - Pelo menos um usuário com email e telefone
   - IDs únicos

2. **Formato dos dados**:
   - Email: formato válido (ex: teste@email.com)
   - Telefone: formato (11) 99999-9999
   - DataCadastro: formato ISO (será preenchido automaticamente)

## Próximos Passos

Após adicionar os dados de teste:
1. Teste o login com os dados fornecidos
2. Se funcionar, você pode cadastrar novos usuários pelo sistema
3. Se não funcionar, verifique se o Google Apps Script está publicado corretamente

## Troubleshooting

Se ainda não funcionar:
1. Verifique se a planilha tem as permissões corretas
2. Confirme se o Google Apps Script está publicado
3. Verifique o console do navegador para erros
4. Teste a API diretamente usando o arquivo `teste-api.html` 