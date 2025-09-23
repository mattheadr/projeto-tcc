// routes/auth_medico.js
import { Router } from 'express';
import  pool  from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = Router();

router.post('/register', async (req, res) => {
  try{
    const { crm, email, telefone, senha } = req.body;
    if(!crm || !senha) return res.status(400).json({ message: 'crm e senha obrigatórios' });

    const [exists] = await pool.query('SELECT 1 FROM TB_MEDICO WHERE CRM_MEDICO=?', [crm]);
    if(exists.length) return res.status(400).json({ message: 'Médico já existe' });

    const hash = await bcrypt.hash(String(senha), 10);
    await pool.query('INSERT INTO TB_MEDICO (CRM_MEDICO,EMAIL_MEDICO,TELEFONE_MEDICO,SENHA_MEDICO) VALUES (?,?,?,?)', [crm,email,telefone,hash]);
    res.json({ ok:true });
  }catch(e){ res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try{
    const { crm, senha } = req.body;
    const [r] = await pool.query('SELECT CRM_MEDICO as crm, SENHA_MEDICO as senha FROM TB_MEDICO WHERE CRM_MEDICO=?', [crm]);
    const user = r[0];
    if(!user) return res.status(404).json({ message: 'Médico não encontrado' });
    const ok = await bcrypt.compare(String(senha), user.senha||'');
    if(!ok) return res.status(401).json({ message: 'Senha inválida' });
    const token = jwt.sign({ id: user.crm, role: 'medico' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: 'medico', id: user.crm });
  }catch(e){ res.status(500).json({ message: e.message }); }
});

export default router;
