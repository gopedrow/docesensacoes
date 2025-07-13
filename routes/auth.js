const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Função para validar força da senha
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Senha deve ter pelo menos ${minLength} caracteres`);
    }
    if (!hasUpperCase) {
        errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    if (!hasLowerCase) {
        errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    if (!hasNumbers) {
        errors.push('Senha deve conter pelo menos um número');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Função para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar telefone
function validatePhone(phone) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
}

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND active = true',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 401,
        error: 'Credenciais inválidas'
      });
    }

    const user = result.rows[0];

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 401,
        error: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      status: 200,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          isAdmin: user.is_admin
        },
        token
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, consentMarketing, consentThirdParty } = req.body;

    // Validações obrigatórias
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        status: 400,
        error: 'Nome, email, senha e telefone são obrigatórios'
      });
    }

    // Validação do nome
    if (name.trim().length < 2) {
      return res.status(400).json({
        status: 400,
        error: 'Nome deve ter pelo menos 2 caracteres'
      });
    }

    // Validação do email
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: 400,
        error: 'Email inválido'
      });
    }

    // Validação do telefone
    if (!validatePhone(phone)) {
      return res.status(400).json({
        status: 400,
        error: 'Telefone inválido. Use o formato (99) 99999-9999'
      });
    }

    // Validação da senha
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        status: 400,
        error: 'Senha inválida',
        details: passwordValidation.errors
      });
    }

    // Verificar se email já existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        status: 400,
        error: 'Email já cadastrado'
      });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Inserir usuário com campos de consentimento
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, address, consent_marketing, consent_third_party, created_at, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), true)
       RETURNING id, name, email, phone, address, created_at`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        phone,
        address || null,
        consentMarketing || false,
        consentThirdParty || false
      ]
    );

    const newUser = result.rows[0];

    // Log de auditoria para LGPD
    console.log(`[LGPD] Novo usuário registrado: ${newUser.email} - Marketing: ${consentMarketing}, Third Party: ${consentThirdParty}`);

    res.status(201).json({
      status: 201,
      message: 'Usuário cadastrado com sucesso',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
          createdAt: newUser.created_at
        }
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    
    // Tratamento específico de erros
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({
        status: 400,
        error: 'Email já cadastrado'
      });
    }
    
    if (error.code === '23514') { // Check constraint violation
      return res.status(400).json({
        status: 400,
        error: 'Dados inválidos fornecidos'
      });
    }

    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

// Rota para solicitar exclusão de dados (LGPD)
router.post('/delete-account', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Verificar credenciais
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND active = true',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'Usuário não encontrado'
      });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        status: 401,
        error: 'Senha incorreta'
      });
    }

    // Soft delete - marcar como inativo
    await pool.query(
      'UPDATE users SET active = false, updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Log de auditoria para LGPD
    console.log(`[LGPD] Conta solicitada para exclusão: ${user.email}`);

    res.json({
      status: 200,
      message: 'Conta marcada para exclusão. Seus dados serão removidos em até 30 dias.'
    });

  } catch (error) {
    console.error('Erro ao solicitar exclusão:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

// Rota para atualizar consentimentos (LGPD)
router.put('/update-consent', async (req, res) => {
  try {
    const { email, consentMarketing, consentThirdParty } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        error: 'Email é obrigatório'
      });
    }

    const result = await pool.query(
      `UPDATE users 
       SET consent_marketing = $1, 
           consent_third_party = $2, 
           updated_at = NOW() 
       WHERE email = $3 AND active = true
       RETURNING id, email, consent_marketing, consent_third_party`,
      [consentMarketing || false, consentThirdParty || false, email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'Usuário não encontrado'
      });
    }

    // Log de auditoria para LGPD
    console.log(`[LGPD] Consentimentos atualizados: ${email} - Marketing: ${consentMarketing}, Third Party: ${consentThirdParty}`);

    res.json({
      status: 200,
      message: 'Consentimentos atualizados com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar consentimentos:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 