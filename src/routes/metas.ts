import express from 'express';
import { listarMetas, criarMeta } from '../controllers/metaController';
import { autenticar } from '../middlewares/auth';

const router = express.Router();
//@ts-ignore
router.get('/', autenticar, listarMetas);
//@ts-ignore
router.post('/', autenticar, criarMeta);

export default router;
