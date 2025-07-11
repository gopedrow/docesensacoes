# 🚀 Guia de Deploy - Doce Sensações

Este guia te ajudará a publicar seu site no GitHub Pages e configurar a integração com Google Apps Script.

## 📋 Pré-requisitos

1. Conta no GitHub
2. Conta no Google (para Google Apps Script e Google Sheets)
3. Git instalado no seu computador

## 🔧 Passo a Passo

### 1. Configurar o Google Apps Script

#### 1.1 Criar a Planilha
1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Renomeie para "Doce Sensações - Base de Dados"
4. Crie as abas conforme especificado em `google-apps-script/README.md`
5. **IMPORTANTE**: Copie o ID da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
   ```

#### 1.2 Configurar o Google Apps Script
1. Acesse [Google Apps Script](https://script.google.com)
2. Clique em "Novo projeto"
3. Renomeie para "Doce Sensações API"
4. Substitua o código padrão pelo conteúdo do arquivo `google-apps-script/Code.gs`
5. **SUBSTITUA** `SUA_SPREADSHEET_ID_AQUI` pelo ID da sua planilha
6. Salve o projeto (Ctrl+S)

#### 1.3 Configurar Permissões
1. Clique em "Executar" > "Executar função" > "doGet"
2. Clique em "Revisar permissões"
3. Selecione sua conta Google
4. Clique em "Avançado" > "Ir para [Nome do Projeto] (não seguro)"
5. Clique em "Permitir"

#### 1.4 Publicar como Web App
1. Clique em "Deploy" > "New deployment"
2. Selecione "Web app"
3. Configure:
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Clique em "Deploy"
5. **COPIE** a URL gerada (será algo como: `https://script.google.com/macros/s/AKfycbz.../exec`)

### 2. Configurar o Projeto Local

#### 2.1 Atualizar a URL da API
1. Abra o arquivo `src/javascript/config.js`
2. Substitua `SUA_API_ID_AQUI` pela URL da sua API do Google Apps Script
3. Salve o arquivo

#### 2.2 Testar Localmente
1. Abra o arquivo `index.html` no navegador
2. Verifique se não há erros no console (F12)
3. Teste as funcionalidades de login e cadastro

### 3. Publicar no GitHub

#### 3.1 Criar Repositório
1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome: `docesensacoes`
4. Descrição: "Site da confeitaria Doce Sensações"
5. Deixe público
6. **NÃO** inicialize com README (já temos um)
7. Clique em "Create repository"

#### 3.2 Fazer Upload dos Arquivos
```bash
# No terminal, navegue até a pasta do projeto
cd /caminho/para/docesensacoes

# Inicializar git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Primeira versão do site Doce Sensações"

# Adicionar repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/docesensacoes.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

### 4. Configurar GitHub Pages

#### 4.1 Ativar GitHub Pages
1. No seu repositório no GitHub, vá em "Settings"
2. Role até "Pages" (no menu lateral esquerdo)
3. Em "Source", selecione "Deploy from a branch"
4. Em "Branch", selecione "main"
5. Em "Folder", selecione "/ (root)"
6. Clique em "Save"

#### 4.2 Aguardar o Deploy
- O GitHub Pages pode levar alguns minutos para fazer o deploy
- Você receberá um email quando estiver pronto
- O site estará disponível em: `https://SEU_USUARIO.github.io/docesensacoes`

### 5. Configurar Domínio Personalizado (Opcional)

#### 5.1 Comprar Domínio
1. Compre um domínio (ex: `docesensacoes.com.br`)
2. Configure os DNS conforme instruções do GitHub

#### 5.2 Configurar no GitHub
1. Em Settings > Pages
2. Em "Custom domain", digite seu domínio
3. Marque "Enforce HTTPS"
4. Salve

## 🧪 Testando o Deploy

### 5.1 Testes Básicos
- [ ] Site carrega corretamente
- [ ] Navegação funciona
- [ ] Imagens aparecem
- [ ] Links funcionam

### 5.2 Testes da API
- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Produtos carregam
- [ ] Carrinho funciona

### 5.3 Testes de Responsividade
- [ ] Site funciona no celular
- [ ] Menu mobile funciona
- [ ] Formulários são responsivos

## 🔍 Troubleshooting

### Erro: "API não encontrada"
- Verifique se a URL da API está correta em `config.js`
- Teste a URL da API diretamente no navegador
- Verifique se o Google Apps Script está publicado

### Erro: "CORS"
- Adicione a função `doOptions` no Google Apps Script
- Verifique se os headers estão configurados

### Erro: "Planilha não encontrada"
- Verifique se o ID da planilha está correto
- Verifique se a planilha está compartilhada

### Site não carrega no GitHub Pages
- Verifique se o repositório é público
- Aguarde alguns minutos para o deploy
- Verifique se não há erros no console

## 📊 Monitoramento

### 6.1 Google Analytics (Recomendado)
1. Crie uma conta no Google Analytics
2. Adicione o código de rastreamento no `<head>` do `index.html`
3. Monitore o tráfego e comportamento dos usuários

### 6.2 Logs do Google Apps Script
1. No Google Apps Script, vá em "Executions"
2. Monitore as execuções da API
3. Verifique se há erros

## 🔄 Atualizações

### Para atualizar o site:
```bash
# Fazer alterações nos arquivos
# Adicionar alterações
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Enviar para o GitHub
git push origin main
```

O GitHub Pages atualizará automaticamente em alguns minutos.

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do Google Apps Script
3. Teste a API diretamente
4. Consulte a documentação do Google Apps Script

## 🎉 Próximos Passos

Após o deploy bem-sucedido:
1. Configure Google Analytics
2. Adicione mais produtos na planilha
3. Configure notificações por email
4. Implemente sistema de pagamento
5. Adicione mais funcionalidades

---

**Parabéns!** Seu site está no ar! 🎊 