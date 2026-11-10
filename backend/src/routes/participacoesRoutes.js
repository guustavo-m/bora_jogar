const express = require('express');
const router = express.Router();

const ParticipacoesController = require('../controllers/participacoesController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Solicitações e participações de uma partida
router.get(
    '/partida/:partida_id',
    ParticipacoesController.listarPorPartida
);

// Participações do usuário autenticado
router.get(
    '/minhas',
    verificarToken,
    ParticipacoesController.listarPorUsuario
);

// Solicitar participação
router.post(
    '/partida/:partida_id',
    verificarToken,
    ParticipacoesController.solicitar
);

// Aprovar solicitação
router.put(
    '/:id/aprovar',
    verificarToken,
    ParticipacoesController.aprovar
);

// Rejeitar solicitação
router.put(
    '/:id/rejeitar',
    verificarToken,
    ParticipacoesController.rejeitar
);

// Cancelar participação
router.put(
    '/:id/cancelar',
    verificarToken,
    ParticipacoesController.cancelar
);

module.exports = router;
