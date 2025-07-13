const fs = require('fs');

const envContent = `DATABASE_URL=postgresql://doce_sensacoes_data_base_user:YU5FOerKRa0NBKdkovwDWQK80OcYPEfQ@dpg-d1pbsdjipnbc73ft075g-a.oregon-postgres.render.com/doce_sensacoes_data_base
JWT_SECRET=doce_sensacoes_jwt_secret_2024_super_seguro
NODE_ENV=production
PORT=3000`;

fs.writeFileSync('.env', envContent);
console.log('Arquivo .env criado com sucesso!');