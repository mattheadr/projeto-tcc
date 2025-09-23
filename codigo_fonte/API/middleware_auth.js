// middleware_auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authMiddleware(req, res, next){
  try{
    const h = req.headers.authorization;
    if(!h) return res.status(401).json({ message: 'Sem token' });
    const t = h.split(' ')[1];
    const payload = jwt.verify(t, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  }catch(e){
    return res.status(401).json({ message: 'Token inválido', detail: e.message });
  }
}
