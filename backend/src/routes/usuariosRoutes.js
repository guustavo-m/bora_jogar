const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuariosController');

function verificarAdmin(req, res, next) {
    if (req.user?.tipo !== 'admin') {
        return res.status(403).json({
            mensagem: 'Acesso permitido somente para administradores'
        });
    }
    next();
}

router.get('/', verificarAdmin, UsuariosController.listarTodos);

router.delete('/:id', verificarAdmin, UsuariosController.deletar);

router.get('/:id', UsuariosController.buscarPorId);

router.put('/:id', UsuariosController.atualizar);

module.exports = router;