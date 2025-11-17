// src/routes/user.ts
import express from 'express';
import { perfilUsuario } from '../controllers/userController';
import { autenticar }   from '../middlewares/auth';

const router = express.Router();


// Rota para obter perfil do usuário autenticado
router.get('/', autenticar, perfilUsuario);

export default router;
