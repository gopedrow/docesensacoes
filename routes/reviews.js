const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Listar avaliações de um produto
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      `SELECT r.*, u.name as user_name FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1 ORDER BY r.created_at DESC`,
      [productId]
    );
    res.json({ status: 200, data: { reviews: result.rows } });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Listar avaliações de um usuário
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT r.*, p.name as product_name FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
      [userId]
    );
    res.json({ status: 200, data: { reviews: result.rows } });
  } catch (error) {
    console.error('Erro ao buscar avaliações do usuário:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Criar avaliação
router.post('/', async (req, res) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;
    if (!product_id || !user_id || !rating) {
      return res.status(400).json({ status: 400, error: 'Dados obrigatórios não fornecidos' });
    }
    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [product_id, user_id, rating, comment || '']
    );
    res.status(201).json({ status: 201, message: 'Avaliação criada com sucesso', data: { review: result.rows[0] } });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Deletar avaliação (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 404, error: 'Avaliação não encontrada' });
    }
    res.json({ status: 200, message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

module.exports = router; 