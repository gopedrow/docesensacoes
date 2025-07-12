# 📊 Criar Planilha no Google Sheets - Doce Sensações

## 🎯 **Objetivo**
Criar a planilha base de dados para o sistema Doce Sensações com todas as abas necessárias.

## 📋 **Passo a Passo**

### **1. Criar Nova Planilha**

1. **Acesse:** https://sheets.google.com
2. **Clique:** "+" para criar nova planilha
3. **Renomeie para:** "Doce Sensações - Base de Dados"

### **2. Criar as Abas**

Crie **4 abas** na planilha:

#### **Aba 1: Produtos**
1. **Clique** na aba "Planilha1" (padrão)
2. **Renomeie** para "Produtos"
3. **Importe** o arquivo `planilha-doce-sensacoes.csv`:
   - **Arquivo** > **Importar**
   - **Selecionar arquivo** > `planilha-doce-sensacoes.csv`
   - **Substituir planilha atual**
   - **Importar dados**

#### **Aba 2: Usuarios**
1. **Clique** no "+" para nova aba
2. **Renomeie** para "Usuarios"
3. **Adicione os cabeçalhos:**
   ```
   A1: ID
   B1: Nome
   C1: Email
   D1: Telefone
   E1: Endereco
   F1: Senha
   G1: Data Cadastro
   H1: Ativo
   ```

#### **Aba 3: Pedidos**
1. **Clique** no "+" para nova aba
2. **Renomeie** para "Pedidos"
3. **Adicione os cabeçalhos:**
   ```
   A1: ID
   B1: UsuarioID
   C1: Produtos
   D1: Total
   E1: Status
   F1: Forma Entrega
   G1: Observacoes
   H1: Data Pedido
   ```

#### **Aba 4: Avaliacoes**
1. **Clique** no "+" para nova aba
2. **Renomeie** para "Avaliacoes"
3. **Adicione os cabeçalhos:**
   ```
   A1: ID
   B1: ProdutoID
   C1: UsuarioID
   D1: Nota
   E1: Comentario
   F1: Data Avaliacao
   G1: Ativo
   ```

### **3. Formatar Cabeçalhos**

Para cada aba:
1. **Selecione** a linha 1 (cabeçalhos)
2. **Clique** em **B** (negrito)
3. **Clique** em **A** (cor de fundo) > **Cinza claro**

### **4. Copiar ID da Planilha**

1. **Copie** o ID da URL:
   ```
   https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
   ```
2. **Guarde** esse ID - você vai precisar no Google Apps Script

## 📊 **Estrutura Final**

Sua planilha deve ter:

| Aba | Colunas | Função |
|-----|---------|--------|
| **Produtos** | 8 colunas | Catálogo de produtos |
| **Usuarios** | 8 colunas | Cadastro de clientes |
| **Pedidos** | 8 colunas | Histórico de pedidos |
| **Avaliacoes** | 7 colunas | Avaliações dos produtos |

## ✅ **Verificação**

Após criar, verifique se:
- [ ] 4 abas criadas
- [ ] Cabeçalhos formatados (negrito + fundo cinza)
- [ ] ID da planilha copiado
- [ ] Aba Produtos com dados de exemplo

## 🎯 **Próximo Passo**

Após criar a planilha:
1. **Copie o ID** da planilha
2. **Vá para** Google Apps Script
3. **Cole o código** que te passei
4. **Substitua** o ID da planilha no código

---

**⏰ Tempo estimado: 10 minutos**
**🎯 Resultado: Planilha pronta para uso** 