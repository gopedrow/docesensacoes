const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE active = true ORDER BY created_at DESC'
    );
    res.json({
      status: 200,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

// GET - Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND active = true',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      status: 200,
      data: rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

// POST - Criar novo produto
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({
        status: 400,
        error: 'Nome, preço e categoria são obrigatórios'
      });
    }
    
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, price, category, image, stock, created_at, active)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), true)
       RETURNING *`,
      [name, description, price, category, image, stock || 0]
    );
    
    res.status(201).json({
      status: 201,
      message: 'Produto criado com sucesso',
      data: rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

// PUT - Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, stock } = req.body;
    
    const { rows } = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           category = COALESCE($4, category),
           image = COALESCE($5, image),
           stock = COALESCE($6, stock),
           updated_at = NOW()
       WHERE id = $7 AND active = true
       RETURNING *`,
      [name, description, price, category, image, stock, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      status: 200,
      message: 'Produto atualizado com sucesso',
      data: rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

// DELETE - Deletar produto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { rows } = await pool.query(
      'UPDATE products SET active = false, updated_at = NOW() WHERE id = $1 AND active = true RETURNING id',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      status: 200,
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

// GET - Buscar produtos por categoria
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE category = $1 AND active = true ORDER BY created_at DESC',
      [category]
    );
    
    res.json({
      status: 200,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    res.status(500).json({
      status: 500,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 