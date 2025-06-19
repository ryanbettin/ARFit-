// server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import metasRoutes from './routes/metas';
import historicoRoutes from './routes/historico';
import gruposRoutes from './routes/grupos';
import dashboardRoutes from './routes/dashboard';
import userRoutes from './routes/user';  // <-- import da nova rota de usuário

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/metas', metasRoutes);
app.use('/historico', historicoRoutes);
app.use('/grupos', gruposRoutes);
app.use('/dashboard', dashboardRoutes); 
app.use('/usuario', userRoutes);  

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
