const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

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
      [email]
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
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        status: 400,
        error: 'Nome, email, senha e telefone são obrigatórios'
      });
    }

    // Verificar se email já existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        status: 400,
        error: 'Email já cadastrado'
      });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir usuário
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, address, created_at, active)
       VALUES ($1, $2, $3, $4, $5, NOW(), true)
       RETURNING id, name, email, phone, address, created_at`,
      [name, email, hashedPassword, phone, address || '']
    );

    const newUser = result.rows[0];

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
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 