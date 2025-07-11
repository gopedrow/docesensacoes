# 📋 Configuração do Google Apps Script

Este documento explica como configurar o Google Apps Script para funcionar como backend da aplicação Doce Sensações.

## 🚀 Passo a Passo

### 1. Criar a Planilha do Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Renomeie para "Doce Sensações - Base de Dados"
4. Crie as seguintes abas:

#### Aba: Produtos
| A (ID) | B (Nome) | C (Descrição) | D (Preço) | E (Categoria) | F (Imagem) | G (Ativo) |
|--------|----------|---------------|-----------|---------------|------------|-----------|
| 1 | Brigadeiro Gourmet | Brigadeiro tradicional com chocolate belga | 5.50 | Docinhos | dish.png | TRUE |
| 2 | Cupcake Red Velvet | Cupcake de red velvet com cream cheese | 8.00 | Cupcakes | dish2.png | TRUE |

#### Aba: Usuarios
| A (ID) | B (Nome) | C (Email) | D (Telefone) | E (Endereço) | F (Data Cadastro) |
|--------|----------|-----------|--------------|--------------|-------------------|
| 1703123456789 | João Silva | joao@email.com | (62) 99999-9999 | Rua A, 123 | 2024-01-15T10:30:00.000Z |

#### Aba: Pedidos
| A (ID) | B (UsuarioID) | C (Produtos) | D (Total) | E (Status) | F (Data) |
|--------|---------------|--------------|-----------|------------|----------|
| 1703123456790 | 1703123456789 | [{"id":"1","qtd":2},{"id":"2","qtd":1}] | 19.00 | Pendente | 2024-01-15T14:20:00.000Z |

#### Aba: Avaliacoes
| A (ID) | B (ProdutoID) | C (UsuarioID) | D (Nota) | E (Comentário) | F (Data) |
|--------|---------------|---------------|----------|----------------|----------|
| 1703123456791 | 1 | 1703123456789 | 5 | Delicioso! | 2024-01-15T16:45:00.000Z |

### 2. Configurar o Google Apps Script

1. Acesse [Google Apps Script](https://script.google.com)
2. Clique em "Novo projeto"
3. Renomeie para "Doce Sensações API"
4. Substitua o código padrão pelo conteúdo do arquivo `Code.gs`
5. **IMPORTANTE**: Substitua `SUA_SPREADSHEET_ID_AQUI` pelo ID da sua planilha
   - Para obter o ID: abra a planilha e copie da URL: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`

### 3. Configurar Permissões

1. No Google Apps Script, clique em "Executar" > "Executar função" > "doGet"
2. Clique em "Revisar permissões"
3. Selecione sua conta Google
4. Clique em "Avançado" > "Ir para [Nome do Projeto] (não seguro)"
5. Clique em "Permitir"

### 4. Publicar como Web App

1. Clique em "Deploy" > "New deployment"
2. Selecione "Web app"
3. Configure:
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Clique em "Deploy"
5. Copie a URL gerada (será algo como: `https://script.google.com/macros/s/AKfycbz.../exec`)

### 5. Configurar CORS (se necessário)

Se houver problemas de CORS, adicione este código ao final do `Code.gs`:

```javascript
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
```

## 🔧 Testando a API

### Teste básico:
```
GET https://script.google.com/macros/s/SEU_ID/exec?action=getProdutos
```

### Teste com Postman ou curl:
```bash
curl "https://script.google.com/macros/s/SEU_ID/exec?action=getProdutos"
```

## 📊 Estrutura das Respostas

Todas as respostas seguem este formato:
```json
{
  "statusCode": 200,
  "data": {
    // dados específicos da operação
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🚨 Troubleshooting

### Erro: "Spreadsheet not found"
- Verifique se o ID da planilha está correto
- Verifique se a planilha está compartilhada com sua conta

### Erro: "Permission denied"
- Execute novamente o processo de autorização
- Verifique se a planilha está compartilhada

### Erro: CORS
- Adicione a função `doOptions` mencionada acima
- Verifique se os headers estão configurados corretamente

## 📝 Notas Importantes

1. **Limites do Google Apps Script**:
   - Máximo 6 horas de execução por dia
   - Máximo 20MB de dados por requisição
   - Máximo 1000 requisições por 100 segundos

2. **Segurança**:
   - A API está configurada para acesso público
   - Para maior segurança, implemente autenticação

3. **Backup**:
   - Faça backup regular da planilha
   - Mantenha cópias do código do Apps Script

## 🔗 Próximos Passos

1. Atualize o arquivo `src/javascript/config.js` com a URL da sua API
2. Teste todas as funcionalidades
3. Configure o domínio personalizado (opcional)
4. Implemente monitoramento de erros 