const express = require('express');
const router = express.Router();

const EsportesController = require('../controllers/esportesController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', EsportesController.listarTodos);

router.get('/:id', EsportesController.buscarPorId);

router.post('/', verificarToken, EsportesController.criar);

router.delete('/:id', verificarToken, EsportesController.deletar);

module.exports = router;
