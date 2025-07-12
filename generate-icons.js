const fs = require('fs');
const path = require('path');

// Função para criar um ícone simples baseado no logo existente
function createIcon(size) {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8E8E;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#grad1)"/>
  
  <!-- Cake icon -->
  <g transform="translate(${size*0.25}, ${size*0.25}) scale(${size*0.5/100})">
    <!-- Cake base -->
    <rect x="20" y="60" width="60" height="20" rx="5" fill="#8B4513"/>
    
    <!-- Cake layers -->
    <rect x="15" y="45" width="70" height="15" rx="3" fill="#DEB887"/>
    <rect x="10" y="30" width="80" height="15" rx="3" fill="#F5DEB3"/>
    <rect x="5" y="15" width="90" height="15" rx="3" fill="#FFF8DC"/>
    
    <!-- Candles -->
    <rect x="35" y="5" width="3" height="10" fill="#FFD700"/>
    <rect x="45" y="5" width="3" height="10" fill="#FFD700"/>
    <rect x="55" y="5" width="3" height="10" fill="#FFD700"/>
    <rect x="65" y="5" width="3" height="10" fill="#FFD700"/>
    
    <!-- Candle flames -->
    <circle cx="36.5" cy="3" r="2" fill="#FF4500"/>
    <circle cx="46.5" cy="3" r="2" fill="#FF4500"/>
    <circle cx="56.5" cy="3" r="2" fill="#FF4500"/>
    <circle cx="66.5" cy="3" r="2" fill="#FF4500"/>
    
    <!-- Sprinkles -->
    <circle cx="25" cy="25" r="1" fill="#FF69B4"/>
    <circle cx="75" cy="25" r="1" fill="#FF69B4"/>
    <circle cx="30" cy="35" r="1" fill="#87CEEB"/>
    <circle cx="70" cy="35" r="1" fill="#87CEEB"/>
    <circle cx="50" cy="40" r="1" fill="#98FB98"/>
  </g>
  
  <!-- Text -->
  <text x="${size/2}" y="${size-10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size/8}" fill="white" font-weight="bold">DS</text>
</svg>`;

  return svg;
}

// Tamanhos de ícones necessários
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Criar diretório de imagens se não existir
const imagesDir = path.join(__dirname, 'src', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

console.log('Gerando ícones do PWA...');

// Gerar cada ícone
iconSizes.forEach(size => {
  const svg = createIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(imagesDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✓ ${filename} criado`);
});

console.log('\nÍcones SVG criados com sucesso!');
console.log('\nPara converter para PNG, você pode:');
console.log('1. Usar ferramentas online como convertio.co');
console.log('2. Usar o Inkscape (gratuito)');
console.log('3. Usar o GIMP (gratuito)');
console.log('4. Usar o Photoshop');
console.log('\nOu instalar o pacote sharp e executar:');
console.log('npm install sharp');
console.log('node convert-svg-to-png.js'); 