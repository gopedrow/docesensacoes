# 🔧 Atualizar Google Apps Script

## ❌ Problema Atual
O Google Apps Script está retornando erro: `TypeError: output.addHeader is not a function`

## ✅ Solução
Copie o código corrigido do arquivo `google-apps-script/Code.gs` para o Google Apps Script.

## 📋 Passos para Atualizar

### 1. Acessar o Google Apps Script
1. Vá para: https://script.google.com/
2. Abra o projeto: `AKfycbw2o3d6ytgBi91T6A8P8mhlUz_4c8hkxCEcbRrvTEWvSCtVswbJKmn8T6ydGC-Nz3LN`

### 2. Substituir o Código
1. Abra o arquivo `Code.gs`
2. **Selecione todo o conteúdo** (Ctrl+A)
3. **Delete tudo**
4. **Cole o código corrigido** do arquivo `google-apps-script/Code.gs`

### 3. Salvar e Testar
1. Clique em **"Salvar"** (ícone de disquete)
2. Clique em **"Executar"** para testar
3. Autorize se necessário

## 🔍 Teste da API

### Teste via Navegador
Acesse esta URL para testar:
```
https://script.google.com/macros/s/AKfycbw2o3d6ytgBi91T6A8P8mhlUz_4c8hkxCEcbRrvTEWvSCtVswbJKmn8T6ydGC-Nz3LN/exec?action=getProdutos
```

### Resposta Esperada
```json
{
  "statusCode": 200,
  "data": {
    "produtos": [
      {
        "id": "1",
        "nome": "Cupcake de Chocolate",
        "descricao": "Delicioso cupcake com cobertura de chocolate",
        "preco": 8.50,
        "categoria": "Cupcakes",
        "imagem": "cupcake-chocolate.jpg",
        "ativo": true
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🚨 Se Ainda Houver Erro

### Verificar Planilha
1. Confirme que a planilha ID está correto: `1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso`
2. Verifique se existe a aba "Produtos"
3. Confirme que há dados na planilha

### Verificar Permissões
1. O script precisa ter permissão para acessar a planilha
2. Execute o script uma vez para autorizar

## 📞 Suporte
Se o problema persistir, verifique:
- Logs do Google Apps Script
- Console do navegador (F12)
- Status da planilha

---

**Após atualizar, teste a página do cardápio novamente!** 🎯 