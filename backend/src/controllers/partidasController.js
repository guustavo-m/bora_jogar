const PartidasModel = require('../models/partidasModel');

function obterUsuarioId(req) {
    return req.usuario?.id ?? req.user?.id;
}

async function listarTodos(req, res) {
    try {
        const partidas = await PartidasModel.listarTodos();

        return res.status(200).json(partidas);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao listar partidas',
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

        const partida = await PartidasModel.buscarPorId(id);

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada'
            });
        }

        return res.status(200).json(partida);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar partida',
            erro: erro.message
        });
    }
}

async function criar(req, res) {
    try {
        const {
            nome,
            esporte_id,
            data,
            horario,
            local,
            max_participantes,
            descricao
        } = req.body;

        const organizador_id = obterUsuarioId(req);

        if (!organizador_id) {
            return res.status(401).json({
                mensagem: 'Usuário não identificado pelo token'
            });
        }

        const camposObrigatorios = [
            nome,
            esporte_id,
            data,
            horario,
            local,
            max_participantes
        ];

        if (camposObrigatorios.some(campo =>
            campo === undefined ||
            campo === null ||
            campo === ''
        )) {
            return res.status(400).json({
                mensagem: 'Preencha todos os campos obrigatórios'
            });
        }

        if (!Number.isInteger(Number(esporte_id)) ||
            !Number.isInteger(Number(max_participantes)) ||
            Number(max_participantes) <= 0) {
            return res.status(400).json({
                mensagem: 'Esporte ou quantidade de participantes inválidos'
            });
        }

        const novaPartida = await PartidasModel.criar({
            nome,
            esporte_id,
            organizador_id,
            data,
            horario,
            local,
            max_participantes,
            descricao
        });

        return res.status(201).json(novaPartida);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao criar partida',
            erro: erro.message
        });
    }
}

async function atualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const usuarioId = obterUsuarioId(req);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido'
            });
        }

        const partida = await PartidasModel.buscarPorId(id);

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada'
            });
        }

        if (Number(partida.organizador_id) !== Number(usuarioId)) {
            return res.status(403).json({
                mensagem: 'Somente o organizador pode editar esta partida'
            });
        }

        const {
            nome,
            esporte_id,
            data,
            horario,
            local,
            max_participantes,
            descricao
        } = req.body;

        const camposObrigatorios = [
            nome,
            esporte_id,
            data,
            horario,
            local,
            max_participantes
        ];

        if (camposObrigatorios.some(campo =>
            campo === undefined ||
            campo === null ||
            campo === ''
        )) {
            return res.status(400).json({
                mensagem: 'Preencha todos os campos obrigatórios'
            });
        }

        if (!Number.isInteger(Number(esporte_id)) ||
            !Number.isInteger(Number(max_participantes)) ||
            Number(max_participantes) <= 0) {
            return res.status(400).json({
                mensagem: 'Esporte ou quantidade de participantes inválidos'
            });
        }

        if (Number(max_participantes) <
            Number(partida.participantes_confirmados)) {
            return res.status(400).json({
                mensagem: 'O limite não pode ser menor que os participantes confirmados'
            });
        }

        const atualizada = await PartidasModel.atualizar(id, {
            nome,
            esporte_id,
            data,
            horario,
            local,
            max_participantes,
            descricao
        });

        return res.status(200).json(atualizada);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar partida',
            erro: erro.message
        });
    }
}

async function deletar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const usuarioId = obterUsuarioId(req);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido'
            });
        }

        const partida = await PartidasModel.buscarPorId(id);

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada'
            });
        }

        if (Number(partida.organizador_id) !== Number(usuarioId)) {
            return res.status(403).json({
                mensagem: 'Somente o organizador pode excluir esta partida'
            });
        }

        await PartidasModel.deletar(id);

        return res.status(200).json({
            mensagem: 'Partida removida com sucesso'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao deletar partida',
            erro: erro.message
        });
    }
}

async function buscarParticipantes(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido'
            });
        }

        const partida = await PartidasModel.buscarPorId(id);

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada'
            });
        }

        const participantes = await PartidasModel.buscarParticipantes(id);

        return res.status(200).json(participantes);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao listar participantes',
            erro: erro.message
        });
    }
}

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    atualizar,
    deletar,
    buscarParticipantes
};
