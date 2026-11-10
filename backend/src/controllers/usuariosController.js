const UsuarioModel = require('../models/usuariosModel');

async function listarTodos(req, res) {
    try {
        const usuarios = await UsuarioModel.listarTodos();

        return res.status(200).json(usuarios);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao listar usuários',
            erro: erro.message
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido'
            });
        }

        const ehAdmin = req.user.tipo === 'admin';
        const ehDono = req.user.id === id;

        if (!ehAdmin && !ehDono) {
            return res.status(403).json({
                mensagem: 'Você não pode consultar este perfil'
            });
        }

        const usuario = await UsuarioModel.buscarPorId(id);

        if (!usuario) {
            return res.status(404).json({
                mensagem: `Usuário ${id} não encontrado`
            });
        }

        return res.status(200).json(usuario);

    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar usuário',
            erro: erro.message
        });
    }
}

async function atualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { nome, email, tipo } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido'
            });
        }

        const ehAdmin = req.user.tipo === 'admin';
        const ehDono = req.user.id === id;

        if (!ehAdmin && !ehDono) {
            return res.status(403).json({
                mensagem: 'Você não pode editar este perfil'
            });
        }

        if (!nome || !email) {
            return res.status(400).json({
                mensagem: 'Nome e e-mail são obrigatórios'
            });
        }

        // Usuários comuns não podem alterar o próprio tipo.
        let tipoFinal = req.user.tipo;

        if (ehAdmin) {
            tipoFinal = tipo || 'user';

            if (!['user', 'admin'].includes(tipoFinal)) {
                return res.status(400).json({
                    mensagem: 'Tipo de conta inválido'
                });
            }
        }

        const usuarioAtualizado = await UsuarioModel.atualizar(id, {
            nome,
            email,
            tipo: tipoFinal
        });

        if (!usuarioAtualizado) {
            return res.status(404).json({
                mensagem: `Usuário ${id} não encontrado`
            });
        }

        return res.status(200).json(usuarioAtualizado);

    } catch (erro) {
        console.error('Erro ao atualizar usuário:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao atualizar usuário',
            erro: erro.message
        });
    }
}

async function deletar(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido'
            });
        }

        const deletado = await UsuarioModel.deletar(id);

        if (!deletado) {
            return res.status(404).json({
                mensagem: `Usuário ${id} não encontrado`
            });
        }

        return res.status(200).json({
            mensagem: `Usuário ${id} removido com sucesso`
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao deletar usuário',
            erro: erro.message
        });
    }
}

module.exports = {
    listarTodos,
    buscarPorId,
    atualizar,
    deletar
};