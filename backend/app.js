require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

const { verificarToken } = require('./src/middlewares/authMiddleware');

const esportesRoutes = require('./src/routes/esportesRoutes');
app.use('/esportes', esportesRoutes);

const partidasRoutes = require('./src/routes/partidasRoutes');
app.use('/partidas', partidasRoutes);

const participacoesRoutes = require('./src/routes/participacoesRoutes');
app.use('/participacoes', participacoesRoutes);

const usuariosRoutes = require('./src/routes/usuariosRoutes');
app.use('/usuarios', verificarToken, usuariosRoutes);

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API com React e com PostgreSQL',
    versao: '3.0',
    ambiente: process.env.NODE_ENV || 'development',
    banco: 'PostgreSQL'
  });
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Servidor rodando!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`💾 Banco: PostgreSQL (${process.env.DB_NAME})`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});