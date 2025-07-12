const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Listar todos os usuários (admin)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, phone, address, is_admin, created_at, active FROM users WHERE active = true ORDER BY created_at DESC');
    res.json({ status: 200, data: { users: result.rows } });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, email, phone, address, is_admin, created_at, active FROM users WHERE id = $1 AND active = true', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 404, error: 'Usuário não encontrado' });
    }
    res.json({ status: 200, data: { user: result.rows[0] } });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Atualizar usuário (próprio usuário ou admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;
    const result = await pool.query(
      `UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), address = COALESCE($3, address), updated_at = NOW() WHERE id = $4 AND active = true RETURNING id, name, email, phone, address, is_admin, created_at, active`,
      [name, phone, address, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 404, error: 'Usuário não encontrado' });
    }
    res.json({ status: 200, message: 'Usuário atualizado com sucesso', data: { user: result.rows[0] } });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Deletar usuário (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE users SET active = false, updated_at = NOW() WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 404, error: 'Usuário não encontrado' });
    }
    res.json({ status: 200, message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

module.exports = router; 