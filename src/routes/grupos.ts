import express from 'express';
import { listarGrupos } from '../controllers/grupoController';

const router = express.Router();

router.get('/', listarGrupos);

export default router;
