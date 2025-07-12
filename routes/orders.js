const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Listar todos os pedidos (admin)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({ status: 200, data: { orders: result.rows } });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Listar pedidos de um usuário
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json({ status: 200, data: { orders: result.rows } });
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Criar pedido
router.post('/', async (req, res) => {
  try {
    const { user_id, total, status, items } = req.body;
    if (!user_id || !total || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ status: 400, error: 'Dados obrigatórios não fornecidos' });
    }
    // Criar pedido
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total, status, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [user_id, total, status || 'pendente']
    );
    const order = orderResult.rows[0];
    // Inserir itens do pedido
    const itemQueries = items.map(item =>
      pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      )
    );
    await Promise.all(itemQueries);
    res.status(201).json({ status: 201, message: 'Pedido criado com sucesso', data: { order } });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Atualizar status do pedido
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 404, error: 'Pedido não encontrado' });
    }
    res.json({ status: 200, message: 'Status do pedido atualizado', data: { order: result.rows[0] } });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

// Deletar pedido (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Aqui, apenas deletamos os itens do pedido e o pedido (pode ser soft delete se preferir)
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [id]);
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 404, error: 'Pedido não encontrado' });
    }
    res.json({ status: 200, message: 'Pedido deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({ status: 500, error: 'Erro interno do servidor' });
  }
});

module.exports = router; 