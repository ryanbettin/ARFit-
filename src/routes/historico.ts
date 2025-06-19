import express from 'express';
import { registrarHistorico, listarHistorico } from '../controllers/historicoController';
import { autenticar } from '../middlewares/auth';

const router = express.Router();

// Rota para registrar conclusão de exercício
router.post('/', autenticar, registrarHistorico);

// Rota para listar histórico do usuário
router.get('/', autenticar, listarHistorico);

export default router;
