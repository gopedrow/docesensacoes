# 🌐 Configuração de Domínio - Doce Sensações

## 📋 **PASSO A PASSO PARA CONFIGURAR DOMÍNIO**

### **1. COMPRAR DOMÍNIO**

#### **Opções Recomendadas:**
- **Registro.br** (para .com.br): https://registro.br
- **GoDaddy**: https://godaddy.com
- **Namecheap**: https://namecheap.com
- **Google Domains**: https://domains.google

#### **Domínios Sugeridos:**
- `docesensacoes.com.br` (recomendado)
- `docesensacoes.com`
- `docesensacoes.net`
- `docesensacoes.store`

### **2. CONFIGURAR DNS NO VERCEL**

#### **2.1 Acessar Dashboard do Vercel**
1. Vá para: https://vercel.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto "docesensacoes"

#### **2.2 Adicionar Domínio**
1. Clique em **"Settings"**
2. Vá para a aba **"Domains"**
3. Clique em **"Add Domain"**
4. Digite seu domínio (ex: `docesensacoes.com.br`)
5. Clique em **"Add"**

#### **2.3 Configurar Registros DNS**
O Vercel vai mostrar os registros DNS necessários. Configure no seu provedor de domínio:

**Para domínio principal:**
```
Tipo: A
Nome: @
Valor: 76.76.19.36
TTL: 3600
```

**Para www:**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

### **3. CONFIGURAR NO PROVEDOR DE DOMÍNIO**

#### **3.1 Registro.br (.com.br)**
1. Acesse: https://registro.br
2. Faça login na sua conta
3. Vá em **"Gerenciar"** → **"DNS"**
4. Adicione os registros mostrados pelo Vercel
5. Aguarde propagação (pode levar até 24h)

#### **3.2 GoDaddy**
1. Acesse: https://godaddy.com
2. Vá em **"My Products"** → **"DNS"**
3. Clique em **"Manage DNS"**
4. Adicione os registros A e CNAME
5. Salve as alterações

### **4. VERIFICAR CONFIGURAÇÃO**

#### **4.1 Teste de Propagação**
```bash
# Verificar se o domínio está apontando para o Vercel
nslookup docesensacoes.com.br
nslookup www.docesensacoes.com.br
```

#### **4.2 Teste de Acesso**
- Acesse: `https://docesensacoes.com.br`
- Deve carregar o site normalmente
- Verifique se o HTTPS está funcionando

### **5. CONFIGURAR REDIRECIONAMENTOS**

#### **5.1 No Vercel Dashboard**
1. Vá em **"Settings"** → **"Domains"**
2. Configure redirecionamentos:
   - `www.docesensacoes.com.br` → `docesensacoes.com.br`
   - `docesensacoes.com` → `docesensacoes.com.br` (se comprou ambos)

### **6. ATUALIZAR CONFIGURAÇÕES DO PROJETO**

#### **6.1 CORS já atualizado**
O backend já foi configurado para aceitar o novo domínio.

#### **6.2 Atualizar referências**
```javascript
// Em src/javascript/config.js (se necessário)
const API_CONFIG = {
    BASE_URL: 'https://docesensacoes-2.onrender.com/api',
    // O backend continuará o mesmo
};
```

### **7. TESTE FINAL**

#### **7.1 Teste de Funcionalidade**
1. Acesse o novo domínio
2. Teste login/registro
3. Teste carregamento de produtos
4. Teste carrinho de compras

#### **7.2 Teste de CORS**
```bash
# Testar se o novo domínio consegue acessar a API
curl -H "Origin: https://docesensacoes.com.br" \
     https://docesensacoes-2.onrender.com/api/test
```

### **8. CONFIGURAÇÕES ADICIONAIS**

#### **8.1 Google Analytics**
1. Crie uma conta no Google Analytics
2. Adicione o código de rastreamento no `<head>` do site
3. Configure o domínio personalizado

#### **8.2 Google Search Console**
1. Acesse: https://search.google.com/search-console
2. Adicione o novo domínio
3. Verifique a propriedade
4. Envie o sitemap

#### **8.3 SSL/HTTPS**
- O Vercel fornece SSL automaticamente
- Verifique se está funcionando: `https://docesensacoes.com.br`

---

## 🛠️ **COMANDOS ÚTEIS**

```bash
# Verificar propagação DNS
dig docesensacoes.com.br
nslookup docesensacoes.com.br

# Testar conectividade
curl -I https://docesensacoes.com.br

# Testar CORS
curl -H "Origin: https://docesensacoes.com.br" \
     https://docesensacoes-2.onrender.com/api/test
```

---

## 📞 **SUPORTE**

- **Vercel Support**: https://vercel.com/support
- **Registro.br**: https://registro.br/suporte
- **GoDaddy Support**: https://godaddy.com/help

---

## ⏱️ **TEMPO ESTIMADO**

- **Compra do domínio**: 10 minutos
- **Configuração DNS**: 30 minutos
- **Propagação**: 2-24 horas
- **Testes finais**: 30 minutos

**Total**: 1-2 dias para configuração completa

---

**🎉 Após a configuração, seu site estará disponível em: https://docesensacoes.com.br** 