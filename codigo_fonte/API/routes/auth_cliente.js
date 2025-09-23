// routes/auth_cliente.js
import { Router } from 'express';
import  pool  from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = Router();

router.post('/register', async (req, res) => {
  try{
    const { cpf, nome, email, senha } = req.body;
    if(!cpf || !nome || !senha) return res.status(400).json({ message: 'cpf, nome e senha obrigatórios' });

    const [exists] = await pool.query('SELECT 1 FROM TB_CLIENTE WHERE CPF_CLIENTE=?', [cpf]);
    if(exists.length) return res.status(400).json({ message: 'Cliente já existe' });

    const hash = await bcrypt.hash(String(senha), 10);
    await pool.query('INSERT INTO TB_CLIENTE (CPF_CLIENTE,NOME_CLIENTE,EMAIL_CLIENTE,SENHA_CLIENTE) VALUES (?,?,?,?)', [cpf,nome,email,hash]);
    res.json({ ok:true });
  }catch(e){ res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try{
    const { cpf, senha } = req.body;
    const [r] = await pool.query('SELECT CPF_CLIENTE as cpf, SENHA_CLIENTE as senha FROM TB_CLIENTE WHERE CPF_CLIENTE=?', [cpf]);
    const user = r[0];
    if(!user) return res.status(404).json({ message: 'Cliente não encontrado' });
    const ok = await bcrypt.compare(String(senha), user.senha||'');
    if(!ok) return res.status(401).json({ message: 'Senha inválida' });
    const token = jwt.sign({ id: user.cpf, role: 'cliente' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: 'cliente', id: user.cpf });
  }catch(e){ res.status(500).json({ message: e.message }); }
});

export default router;
