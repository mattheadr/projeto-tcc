// routes/clientes.js
import { Router } from 'express';
import pool from '../db.js';
const router = Router();

// exemplo simples: listar clientes (não expor senhas)
router.get('/', async (req, res) => {
  try{
    const [rows] = await pool.query('SELECT CPF_CLIENTE as cpf, NOME_CLIENTE as nome, EMAIL_CLIENTE as email FROM TB_CLIENTE');
    res.json(rows);
  }catch(e){ res.status(500).json({ message: e.message }); }
});

export default router;
