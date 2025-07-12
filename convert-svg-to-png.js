const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Tamanhos de ícones necessários
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Diretório de imagens
const imagesDir = path.join(__dirname, 'src', 'images');

console.log('Convertendo ícones SVG para PNG...');

async function convertSvgToPng() {
  try {
    for (const size of iconSizes) {
      const svgPath = path.join(imagesDir, `icon-${size}x${size}.svg`);
      const pngPath = path.join(imagesDir, `icon-${size}x${size}.png`);
      
      if (fs.existsSync(svgPath)) {
        await sharp(svgPath)
          .resize(size, size)
          .png()
          .toFile(pngPath);
        
        console.log(`✓ icon-${size}x${size}.png criado`);
      } else {
        console.log(`⚠ icon-${size}x${size}.svg não encontrado`);
      }
    }
    
    console.log('\nConversão concluída com sucesso!');
    console.log('Todos os ícones PNG foram criados.');
    
  } catch (error) {
    console.error('Erro durante a conversão:', error);
    console.log('\nPara instalar o sharp, execute:');
    console.log('npm install sharp');
  }
}

convertSvgToPng(); 