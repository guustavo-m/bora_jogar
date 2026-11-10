const express = require('express');
const router = express.Router();

const PartidasController = require('../controllers/partidasController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', PartidasController.listarTodos);

router.get('/:id/participantes', PartidasController.buscarParticipantes);

router.get('/:id', PartidasController.buscarPorId);

router.post('/', verificarToken, PartidasController.criar);

router.put('/:id', verificarToken, PartidasController.atualizar);

router.delete('/:id', verificarToken, PartidasController.deletar);

module.exports = router;
