import express from 'express';//@ts-ignore
import { obterResumoDashboard } from '../controllers/dashboardController';
import { autenticar } from '../middlewares/auth';

const router = express.Router();
//@ts-ignore
router.get('/', autenticar, obterResumoDashboard);

export default router;
