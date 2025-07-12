# 📋 Instruções para Configurar Cadastro de Produtos com Google Sheets

## 🎯 Objetivo
Configurar o sistema para enviar dados do formulário de cadastro de produtos diretamente para o Google Sheets.

## 📁 Arquivos Criados
- `src/javascript/cadastro-produto.js` - Script frontend
- `google-apps-script/cadastro-produtos.gs` - Código Google Apps Script
- `src/pages/admin-cadastro-produto.html` - Atualizado com integração

---

## 🔧 PASSO A PASSO

### 1️⃣ **Configurar Google Sheets**

1. **Abrir sua planilha do Google Sheets**
   - Vá para [sheets.google.com](https://sheets.google.com)
   - Abra a planilha: `1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso`

2. **Criar aba "Produtos" (se não existir)**
   - Clique no "+" no final das abas
   - Nomeie como "Produtos"

3. **Configurar cabeçalhos**
   - Na primeira linha, adicione os seguintes cabeçalhos:
   ```
   A1: ID
   B1: Nome
   C1: Descrição
   D1: Preço
   E1: Categoria
   F1: Imagem
   G1: Ativo
   H1: Modalidades
   I1: Desconto (%)
   J1: Data Cadastro
   K1: Data Atualização
   ```

### 2️⃣ **Configurar Google Apps Script**

1. **Abrir Google Apps Script**
   - Vá para [script.google.com](https://script.google.com)
   - Clique em "Novo projeto"

2. **Renomear projeto**
   - Clique no nome "Projeto sem título"
   - Renomeie para "Doce Sensações - Cadastro de Produtos"

3. **Substituir código**
   - Delete todo o código existente
   - Cole o código do arquivo `google-apps-script/cadastro-produtos.gs`

4. **Configurar ID da planilha**
   - No código, localize a linha:
   ```javascript
   const SPREADSHEET_ID = '1OuKriX9s3oFKDBXDUsZDlzjutPwVwwFKn-75QZuhTso';
   ```
   - **Substitua pelo ID da sua planilha** (se diferente)

5. **Salvar projeto**
   - Clique em "Salvar" (Ctrl+S)
   - Nome: "Doce Sensações - Cadastro de Produtos"

### 3️⃣ **Configurar Permissões**

1. **Executar função de configuração**
   - No Google Apps Script, clique em "Executar"
   - Selecione a função `configurarCabecalhos`
   - Clique em "Executar"

2. **Autorizar permissões**
   - Clique em "Revisar permissões"
   - Selecione sua conta Google
   - Clique em "Avançado" → "Ir para [nome do projeto]"
   - Clique em "Permitir"

3. **Verificar configuração**
   - Volte para o Google Sheets
   - Verifique se a aba "Produtos" foi criada com os cabeçalhos

### 4️⃣ **Publicar como Web App**

1. **Configurar implantação**
   - No Google Apps Script, clique em "Implantar" → "Nova implantação"
   - Tipo: "Aplicativo da web"
   - Descrição: "v1.0 - Cadastro de Produtos"

2. **Configurar acesso**
   - Execute como: "Eu mesmo"
   - Quem tem acesso: "Qualquer pessoa"
   - Clique em "Implantar"

3. **Copiar URL**
   - Clique em "Autorizar acesso"
   - Copie a URL gerada (algo como: `https://script.google.com/macros/s/.../exec`)

### 5️⃣ **Configurar Frontend**

1. **Atualizar URL no script**
   - Abra o arquivo `src/javascript/cadastro-produto.js`
   - Localize a linha:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
   - **Substitua pela URL copiada no passo anterior**

2. **Testar conexão**
   - Abra `src/pages/admin-cadastro-produto.html` no navegador
   - Abra o Console (F12)
   - Verifique se aparece: "✅ Conexão com Google Apps Script OK"

### 6️⃣ **Testar Sistema**

1. **Preencher formulário**
   - Acesse a página de cadastro
   - Preencha todos os campos obrigatórios
   - Clique em "Cadastrar Produto"

2. **Verificar resultado**
   - Deve aparecer mensagem de sucesso
   - Verifique no Google Sheets se os dados foram inseridos
   - Verifique no Console se não há erros

---

## 🔍 **ESTRUTURA DOS DADOS**

### Campos do Formulário → Colunas da Planilha:
- **ID** → Coluna A (gerado automaticamente)
- **Nome** → Coluna B (obrigatório)
- **Descrição** → Coluna C (obrigatório)
- **Preço** → Coluna D (obrigatório)
- **Categoria** → Coluna E (obrigatório)
- **Imagem** → Coluna F (base64 ou URL)
- **Status** → Coluna G (Ativo/Inativo/Pendente)
- **Modalidades** → Coluna H (separadas por vírgula)
- **Desconto** → Coluna I (0-100%)
- **Data Cadastro** → Coluna J (automático)
- **Data Atualização** → Coluna K (automático)

---

## 🚨 **SOLUÇÃO DE PROBLEMAS**

### Erro: "Conexão com Google Apps Script falhou"
- ✅ Verificar se a URL está correta
- ✅ Verificar se o Google Apps Script está publicado
- ✅ Verificar permissões da planilha

### Erro: "Aba Produtos não encontrada"
- ✅ Executar função `configurarCabecalhos`
- ✅ Verificar se a aba existe na planilha

### Erro: "Dados inválidos"
- ✅ Verificar se todos os campos obrigatórios estão preenchidos
- ✅ Verificar formato dos dados (preço como número, etc.)

### Erro: "Erro interno"
- ✅ Verificar Console do navegador (F12)
- ✅ Verificar logs do Google Apps Script
- ✅ Verificar se a planilha não está protegida

---

## 📞 **SUPORTE**

Se encontrar problemas:

1. **Verificar Console do navegador** (F12 → Console)
2. **Verificar logs do Google Apps Script** (Execuções → Ver logs)
3. **Testar URL diretamente** no navegador
4. **Verificar permissões** da planilha e script

---

## ✅ **CHECKLIST FINAL**

- [ ] Planilha criada com aba "Produtos"
- [ ] Cabeçalhos configurados corretamente
- [ ] Google Apps Script criado e publicado
- [ ] URL atualizada no script frontend
- [ ] Permissões configuradas
- [ ] Teste de conexão funcionando
- [ ] Cadastro de produto funcionando
- [ ] Dados aparecendo na planilha

**🎉 Sistema configurado com sucesso!** 