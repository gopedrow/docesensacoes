# Atualizar Google Apps Script

## Problema Identificado
O erro "Cannot read properties of undefined (reading 'contents')" ocorre porque o código não estava verificando se `e.postData` existe antes de tentar acessar suas propriedades.

## Solução
O arquivo `google-apps-script/Code.gs` foi corrigido com as seguintes melhorias:

1. **Verificação segura de parâmetros**: Agora verifica se `e.parameter` e `e.postData` existem antes de acessá-los
2. **Headers CORS**: Adicionados headers para permitir requisições cross-origin
3. **Tratamento de erro melhorado**: Melhor tratamento de requisições GET vs POST

## Passos para Atualizar

### 1. Acessar o Google Apps Script
- Vá para [script.google.com](https://script.google.com)
- Abra o projeto "Doce Sensações API"

### 2. Substituir o Código
- Abra o arquivo `Code.gs`
- Apague todo o conteúdo atual
- Cole o novo código do arquivo `google-apps-script/Code.gs`

### 3. Configurar o ID da Planilha
- Substitua `'SUA_SPREADSHEET_ID_AQUI'` na linha 2 pelo ID real da sua planilha
- O ID está na URL da planilha: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`

### 4. Salvar e Implantar
- Clique em "Salvar" (Ctrl+S)
- Clique em "Implantar" > "Nova implantação"
- Escolha "Web app"
- Configure:
  - **Execute as**: "Me"
  - **Who has access**: "Anyone"
- Clique em "Implantar"
- Copie a nova URL da API

### 5. Atualizar o Frontend
- Abra o arquivo `src/javascript/config.js`
- Substitua a URL da API pela nova URL copiada
- Salve o arquivo

### 6. Testar
- Acesse a página do cardápio
- Verifique se os produtos carregam corretamente

## Estrutura da Planilha
Certifique-se de que sua planilha tem as seguintes abas:
- **Produtos**: id, nome, descricao, preco, categoria, imagem, ativo
- **Usuarios**: id, nome, email, telefone, endereco, dataCadastro
- **Pedidos**: id, usuarioId, produtos, total, status, data
- **Avaliacoes**: id, produtoId, usuarioId, nota, comentario, data

## Dados de Exemplo
Adicione alguns produtos na aba "Produtos" para testar:
```
ID | Nome | Descrição | Preço | Categoria | Imagem | Ativo
1 | Brigadeiro | Delicioso brigadeiro caseiro | 5.00 | Doces | dish.png | TRUE
2 | Beijinho | Beijinho tradicional | 4.50 | Doces | dish2.png | TRUE
``` 