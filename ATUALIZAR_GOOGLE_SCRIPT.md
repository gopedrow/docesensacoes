# Instruções para Atualizar o Google Apps Script

## Problemas Identificados e Soluções

### 1. **Problema Principal: Estrutura de Resposta**
O JavaScript frontend esperava uma estrutura de resposta diferente da que o Google Apps Script estava retornando.

**Solução Aplicada:**
- ✅ Corrigido o JavaScript para lidar corretamente com a estrutura `{ statusCode, data }`
- ✅ Adicionado headers CORS adequados no Google Apps Script
- ✅ Melhorado o tratamento de erros e logging

### 2. **Problemas de CORS**
O Google Apps Script não estava configurado para permitir requisições cross-origin.

**Solução Aplicada:**
- ✅ Adicionado headers CORS em todas as respostas
- ✅ Implementado função `doOptions()` para requisições OPTIONS
- ✅ Configurado headers adequados para `Access-Control-Allow-*`

### 3. **Template não Utilizado**
A página cardapio.html não estava usando o template product-card.html.

**Solução Aplicada:**
- ✅ Implementado sistema de template com placeholders
- ✅ Adicionado estilos CSS completos do template
- ✅ Criado função `createProductCardFromTemplate()`

## Passos para Atualizar o Google Apps Script

### Passo 1: Acessar o Google Apps Script
1. Vá para [script.google.com](https://script.google.com)
2. Abra o projeto "Doce Sensações" (ou crie um novo)
3. Substitua todo o conteúdo do arquivo `Code.gs` pelo código atualizado

### Passo 2: Verificar a Planilha
1. Certifique-se de que a planilha tem o ID correto: `1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso`
2. Verifique se existe uma aba chamada "Produtos"
3. Confirme que a estrutura da aba está assim:
   ```
   ID | Nome | Descrição | Preço | Categoria | Imagem | Ativo
   ```

### Passo 3: Publicar a API
1. Clique em "Deploy" > "New deployment"
2. Escolha "Web app"
3. Configure:
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Clique em "Deploy"
5. Copie a nova URL da API

### Passo 4: Atualizar a URL no Frontend
1. Abra o arquivo `src/javascript/config.js`
2. Substitua a URL da API pela nova URL gerada
3. Salve o arquivo

### Passo 5: Testar a Integração
1. Abra o arquivo `test-api.html` no navegador
2. Clique em "Testar getProdutos"
3. Verifique se os produtos são retornados corretamente

## Código Atualizado do Google Apps Script

O arquivo `google-apps-script/Code.gs` já está atualizado com todas as correções necessárias:

- ✅ Headers CORS adequados
- ✅ Melhor tratamento de erros
- ✅ Logging detalhado para debug
- ✅ Verificação da existência da aba "Produtos"
- ✅ Estrutura de resposta consistente

## Estrutura de Dados Esperada

### Planilha "Produtos"
```
ID | Nome | Descrição | Preço | Categoria | Imagem | Ativo
1  | Brigadeiro Gourmet | Descrição... | 5.50 | Docinhos | dish.png | TRUE
```

### Resposta da API
```json
{
  "statusCode": 200,
  "data": {
    "produtos": [
      {
        "id": "1",
        "nome": "Brigadeiro Gourmet",
        "descricao": "Descrição...",
        "preco": 5.50,
        "categoria": "Docinhos",
        "imagem": "dish.png",
        "ativo": true
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### Se os produtos não aparecerem:
1. Verifique o console do navegador (F12)
2. Use o arquivo `test-api.html` para testar a API
3. Confirme que a aba "Produtos" existe na planilha
4. Verifique se os produtos têm "Ativo" = TRUE

### Se houver erro de CORS:
1. Confirme que o Google Apps Script foi publicado como "Web app"
2. Verifique se "Who has access" está como "Anyone"
3. Teste com o arquivo `test-api.html`

### Se a URL da API não funcionar:
1. Gere uma nova URL no Google Apps Script
2. Atualize o arquivo `config.js`
3. Teste a nova URL no `test-api.html`

## Próximos Passos

Após atualizar o Google Apps Script:

1. **Teste a API**: Use `test-api.html` para verificar se está funcionando
2. **Teste a página**: Acesse `src/pages/cardapio.html` para ver os produtos
3. **Verifique as imagens**: Confirme que as imagens estão na pasta `src/images/`
4. **Teste o carrinho**: Verifique se a funcionalidade de adicionar ao carrinho funciona

## Arquivos Modificados

- ✅ `src/javascript/config.js` - Corrigido tratamento de resposta da API
- ✅ `src/pages/cardapio.html` - Implementado template e melhorado carregamento
- ✅ `google-apps-script/Code.gs` - Adicionado CORS e melhorado logging
- ✅ `test-api.html` - Criado arquivo de teste

Todos os arquivos estão prontos para uso após a atualização do Google Apps Script. 