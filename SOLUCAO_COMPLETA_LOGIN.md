# Solução Completa para o Problema de Login

## Problema Identificado
O sistema não consegue fazer login porque:
1. Não há usuários cadastrados no Google Sheets
2. O sistema está tentando fazer login com email e senha, mas o Google Apps Script está configurado para email e telefone
3. Faltam algumas funções no Google Apps Script

## Solução Passo a Passo

### 1. Atualizar o Google Apps Script

**IMPORTANTE**: Você precisa copiar o código atualizado do arquivo `google-apps-script/Code.gs` e colar no seu Google Apps Script.

1. Abra o Google Apps Script: https://script.google.com/
2. Abra o projeto "Doce Sensações"
3. Substitua TODO o código pelo conteúdo do arquivo `google-apps-script/Code.gs`
4. Clique em "Salvar" (Ctrl+S)
5. Clique em "Implantar" → "Nova implantação"
6. Escolha "Web app"
7. Configure:
   - Execute as: "Me"
   - Who has access: "Anyone"
8. Clique em "Implantar"
9. Copie a nova URL da web app

### 2. Atualizar a URL da API

Após obter a nova URL, atualize o arquivo `src/javascript/config.js`:

```javascript
// Substitua esta linha:
BASE_URL: 'https://script.google.com/macros/s/AKfycbxqWYCVGdBzurYID6kfjCvAW7c8U_qBpHYH2e75xmk_T20grgBGBgW0vEtbeJCsGjIhfA/exec',

// Pela nova URL que você obteve
```

### 3. Adicionar Dados de Teste no Google Sheets

1. Acesse sua planilha: https://docs.google.com/spreadsheets/d/1WrEnjgZKOITTiYLXyahTRUQ8RuYTXD5qxUwDjXFysQc/edit

2. **Crie a aba "Usuarios"** (se não existir):
   - Clique no "+" no final das abas
   - Renomeie para "Usuarios"
   - Adicione os cabeçalhos na primeira linha:
     ```
     ID | Nome | Email | Telefone | Endereco | Senha | Data Cadastro | Ativo
     ```

3. **Adicione um usuário de teste**:
   - ID: `1`
   - Nome: `Usuário Teste`
   - Email: `teste@email.com`
   - Telefone: `(11) 99999-9999`
   - Endereco: `Rua Teste, 123`
   - Senha: `123456`
   - Data Cadastro: `2024-01-01T00:00:00.000Z`
   - Ativo: `TRUE`

### 4. Testar o Sistema

1. **Teste a API diretamente**:
   - Abra o arquivo `teste-usuarios.html` no navegador
   - Clique em "Verificar Usuários"
   - Deve mostrar o usuário de teste

2. **Teste o login**:
   - No mesmo arquivo, use:
     - Email: `teste@email.com`
     - Telefone: `(11) 99999-9999`
   - Clique em "Testar Login"

3. **Teste o sistema completo**:
   - Abra `index.html`
   - Clique em "Entrar"
   - Use os dados de teste

### 5. Configurar Login com Email e Telefone

O sistema agora suporta login com email e telefone. Para usar:

1. **No formulário de login**, use:
   - Email: `teste@email.com`
   - Telefone: `(11) 99999-9999`

2. **Para cadastrar novos usuários**, use o arquivo `teste-usuarios.html`

### 6. Estrutura Completa da Planilha

Sua planilha deve ter estas abas:

#### Aba "Produtos"
| ID | Nome | Descrição | Preço | Categoria | Imagem | Ativo | Data Cadastro |
|----|------|-----------|-------|-----------|--------|-------|---------------|
| 1 | Brigadeiro | Delicioso brigadeiro caseiro | 5.00 | Doces | dish.png | TRUE | 2024-01-01T00:00:00.000Z |

#### Aba "Usuarios"
| ID | Nome | Email | Telefone | Endereco | Senha | Data Cadastro | Ativo |
|----|------|-------|----------|----------|-------|---------------|-------|
| 1 | Usuário Teste | teste@email.com | (11) 99999-9999 | Rua Teste, 123 | 123456 | 2024-01-01T00:00:00.000Z | TRUE |

#### Aba "Pedidos" (pode estar vazia)
| ID | UsuarioID | Produtos | Total | Status | Forma Entrega | Observacoes | Data Pedido |

#### Aba "Avaliacoes" (pode estar vazia)
| ID | ProdutoID | UsuarioID | Nota | Comentario | Data Avaliacao | Ativo |

## Troubleshooting

### Se ainda não funcionar:

1. **Verifique o console do navegador** (F12) para erros
2. **Teste a API diretamente** com `teste-usuarios.html`
3. **Verifique se a planilha tem as permissões corretas**
4. **Confirme se o Google Apps Script foi publicado corretamente**

### Erros comuns:

- **CORS error**: O Google Apps Script não está publicado corretamente
- **"Ação não reconhecida"**: O código não foi atualizado no Google Apps Script
- **"Usuário não encontrado"**: Não há usuários na planilha ou dados incorretos

## Próximos Passos

Após resolver o login:
1. Teste o cadastro de produtos
2. Teste o carrinho de compras
3. Teste a criação de pedidos
4. Configure o sistema para produção

## Dados de Teste Adicionais

Se quiser mais usuários de teste:

| ID | Nome | Email | Telefone | Endereco | Senha | Ativo |
|----|------|-------|----------|----------|-------|-------|
| 2 | Maria Silva | maria@email.com | (11) 88888-8888 | Rua B, 456 | 123456 | TRUE |
| 3 | Pedro Santos | pedro@email.com | (11) 77777-7777 | Rua C, 789 | 123456 | TRUE | 