const bcrypt = require('bcryptjs');

async function generatePasswordHash(password) {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`Senha: ${password}`);
    console.log(`Hash: ${hash}`);
    return hash;
  } catch (error) {
    console.error('Erro ao gerar hash:', error);
  }
}

// Gerar hash para admin123
generatePasswordHash('admin123'); 