# PWA - Doce Sensações

Este projeto foi transformado em um Progressive Web App (PWA) para permitir que os usuários instalem o site como um aplicativo em seus dispositivos móveis.

## 🚀 Funcionalidades do PWA

### ✅ Implementadas
- **Instalação como App**: Os usuários podem instalar o site como um aplicativo nativo
- **Funcionamento Offline**: O site funciona mesmo sem conexão com a internet
- **Cache Inteligente**: Recursos são armazenados em cache para melhor performance
- **Notificações Push**: Suporte para notificações (preparado para implementação futura)
- **Ícones Adaptativos**: Ícones em diferentes tamanhos para todos os dispositivos
- **Tela de Carregamento**: Experiência nativa ao abrir o app
- **Detecção Online/Offline**: Notificações sobre status da conexão

### 📱 Compatibilidade
- ✅ Chrome/Edge (Android/Desktop)
- ✅ Safari (iOS/macOS)
- ✅ Firefox (Android/Desktop)
- ✅ Samsung Internet

## 🛠️ Arquivos Criados/Modificados

### Novos Arquivos
- `manifest.json` - Configuração do PWA
- `sw.js` - Service Worker para cache e offline
- `src/javascript/pwa.js` - Gerenciamento da instalação
- `browserconfig.xml` - Configuração para Microsoft Edge
- `generate-icons.js` - Script para gerar ícones
- `convert-svg-to-png.js` - Conversão de ícones
- `package.json` - Dependências e scripts

### Arquivos Modificados
- `index.html` - Adicionadas meta tags e links do PWA

## 📋 Como Usar

### 1. Gerar Ícones
```bash
# Instalar dependências
npm install

# Gerar ícones SVG
npm run generate-icons

# Converter para PNG (opcional)
npm run convert-icons

# Ou fazer tudo de uma vez
npm run setup-pwa
```

### 2. Testar Localmente
```bash
# Usando Python
npm run dev

# Ou usando Node.js
npm run serve
```

### 3. Testar PWA
1. Abra o site no Chrome/Edge
2. Clique no ícone de instalação na barra de endereços
3. Ou use o botão "Instalar App" que aparece no site

## 🔧 Configuração

### Manifest.json
- **Nome**: "Doce Sensações"
- **Tema**: Cor rosa (#FF6B6B)
- **Display**: Standalone (sem barra de navegação)
- **Orientação**: Portrait (vertical)

### Service Worker
- Cache de todos os recursos estáticos
- Fallback para página offline
- Atualização automática quando há nova versão

## 📱 Como Instalar no Celular

### Android (Chrome)
1. Abra o site no Chrome
2. Toque no menu (3 pontos)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### iOS (Safari)
1. Abra o site no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela Inicial"
4. Confirme a instalação

## 🎨 Personalização

### Cores do Tema
Edite no `manifest.json`:
```json
{
  "theme_color": "#FF6B6B",
  "background_color": "#ffffff"
}
```

### Ícones
- Substitua os arquivos em `src/images/icon-*.png`
- Ou modifique o `generate-icons.js` para criar novos designs

### Nome do App
Edite no `manifest.json`:
```json
{
  "name": "Seu Nome Aqui",
  "short_name": "Nome Curto"
}
```

## 🔍 Testando

### Chrome DevTools
1. Abra DevTools (F12)
2. Vá para a aba "Application"
3. Verifique:
   - Manifest
   - Service Workers
   - Cache Storage

### Lighthouse
1. Abra DevTools
2. Vá para a aba "Lighthouse"
3. Execute o teste de PWA

## 🚨 Solução de Problemas

### PWA não aparece para instalação
- Verifique se está usando HTTPS (ou localhost)
- Confirme se o manifest.json está acessível
- Verifique se o service worker está registrado

### Ícones não aparecem
- Confirme se os arquivos PNG existem
- Verifique os caminhos no manifest.json
- Teste com diferentes tamanhos

### Cache não funciona
- Verifique se o service worker está ativo
- Limpe o cache do navegador
- Verifique a lista de URLs no sw.js

## 📈 Próximos Passos

### Funcionalidades Futuras
- [ ] Notificações push para novos produtos
- [ ] Sincronização de carrinho offline
- [ ] Geolocalização para delivery
- [ ] Pagamento offline
- [ ] Compartilhamento de produtos

### Otimizações
- [ ] Lazy loading de imagens
- [ ] Compressão de recursos
- [ ] Preload de recursos críticos
- [ ] Background sync para pedidos

## 📞 Suporte

Para dúvidas sobre o PWA:
1. Verifique a documentação do Chrome sobre PWA
2. Teste em diferentes dispositivos
3. Use as ferramentas de desenvolvedor do navegador

---

**Nota**: Este PWA foi configurado para funcionar perfeitamente com o site Doce Sensações, mantendo a identidade visual e oferecendo uma experiência nativa aos usuários. 