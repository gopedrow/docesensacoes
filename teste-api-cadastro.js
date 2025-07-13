const fetch = require('node-fetch');

const API_BASE = 'https://docesensacoes-2.onrender.com';

async function testAPI() {
    console.log('🔍 Testando API...');
    
    try {
        const response = await fetch(`${API_BASE}/api/test`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ API funcionando!');
            console.log(`Status: ${data.status}`);
            console.log(`Mensagem: ${data.message}`);
            return true;
        } else {
            console.log('❌ API não está funcionando');
            console.log(`Erro: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.log('❌ Erro de conexão:', error.message);
        return false;
    }
}

async function initDatabase() {
    console.log('\n🗄️ Inicializando banco de dados...');
    
    try {
        const response = await fetch(`${API_BASE}/api/init-database`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Banco inicializado com sucesso!');
            console.log(`Mensagem: ${data.message}`);
            return true;
        } else {
            console.log('❌ Erro ao inicializar banco');
            console.log(`Erro: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.log('❌ Erro de conexão:', error.message);
        return false;
    }
}

async function testRegister() {
    console.log('\n👤 Testando cadastro de usuário...');
    
    const timestamp = Date.now();
    const userData = {
        name: 'Usuário Teste',
        email: `teste${timestamp}@exemplo.com`,
        password: '123456',
        phone: '(11) 99999-9999',
        address: 'Rua Teste, 123'
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Cadastro realizado com sucesso!');
            console.log(`ID: ${data.data.user.id}`);
            console.log(`Nome: ${data.data.user.name}`);
            console.log(`Email: ${data.data.user.email}`);
            return true;
        } else {
            console.log('❌ Erro no cadastro');
            console.log(`Status: ${response.status}`);
            console.log(`Erro: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.log('❌ Erro de conexão:', error.message);
        return false;
    }
}

async function testLogin() {
    console.log('\n🔐 Testando login admin...');
    
    const loginData = {
        email: 'admin@docesensacoes.com',
        password: 'admin123'
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Login realizado com sucesso!');
            console.log(`Nome: ${data.data.user.name}`);
            console.log(`Email: ${data.data.user.email}`);
            console.log(`Admin: ${data.data.user.isAdmin ? 'Sim' : 'Não'}`);
            return true;
        } else {
            console.log('❌ Erro no login');
            console.log(`Status: ${response.status}`);
            console.log(`Erro: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.log('❌ Erro de conexão:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('🚀 Iniciando testes de cadastro...\n');
    
    // Teste 1: API
    const apiOk = await testAPI();
    if (!apiOk) {
        console.log('\n❌ API não está funcionando. Verifique o deploy no Render.');
        return;
    }
    
    // Teste 2: Banco
    const dbOk = await initDatabase();
    if (!dbOk) {
        console.log('\n❌ Erro ao inicializar banco. Tente novamente.');
        return;
    }
    
    // Teste 3: Cadastro
    const registerOk = await testRegister();
    if (!registerOk) {
        console.log('\n❌ Erro no cadastro. Verifique os dados.');
        return;
    }
    
    // Teste 4: Login
    const loginOk = await testLogin();
    if (!loginOk) {
        console.log('\n❌ Erro no login. Verifique as credenciais.');
        return;
    }
    
    console.log('\n🎉 Todos os testes passaram!');
    console.log('✅ Sistema funcionando corretamente');
    console.log('\n🌐 Agora você pode acessar:');
    console.log('   - Cadastro: https://docesensacoes.vercel.app/src/pages/cadastro.html');
    console.log('   - Login: https://docesensacoes.vercel.app/src/pages/login.html');
}

// Executar testes
runAllTests().catch(console.error); 