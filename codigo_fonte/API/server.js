// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientes from '../Api/routes/clientes.js';
import medicos from '../Api/routes/medicos.js';
import consultas from '../Api/routes/consultas.js';
import authCliente from '../Api//routes/auth_cliente.js';
import authMedico from '../Api/routes/auth_medico.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// rotas
app.use('/api/clientes', clientes);
app.use('/api/medicos', medicos);
app.use('/api/consultas', consultas);
app.use('/api/auth/cliente', authCliente);
app.use('/api/auth/medico', authMedico);

app.get('/', (req, res) => res.send('NewCheck API v5.6'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
