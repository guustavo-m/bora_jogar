const ParticipacoesModel = require('../models/participacoesModel');
const PartidasModel = require('../models/partidasModel');

function obterUsuarioId(req) {
    return req.usuario?.id ?? req.user?.id;
}

async function listarPorPartida(req, res) {
    try {
        const partida_id = parseInt(req.params.partida_id);

        if (isNaN(partida_id)) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido'
            });
        }

        const partida = await PartidasModel.buscarPorId(partida_id);

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada'
            });
        }

        const participacoes =
            await ParticipacoesModel.listarPorPartida(partida_id);

        return res.status(200).json(participacoes);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao listar participações',
            erro: erro.message
        });
    }
}

async function listarPorUsuario(req, res) {
    try {
        const usuario_id = obterUsuarioId(req);

        if (!usuario_id) {
            return res.status(401).json({
                mensagem: 'Usuário não identificado'
            });
        }

        const participacoes =
            await ParticipacoesModel.listarPorUsuario(usuario_id);

        return res.status(200).json(participacoes);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao listar suas participações',
            erro: erro.message
        });
    }
}

async function solicitar(req, res) {
    try {
        const partida_id = parseInt(req.params.partida_id);
        const usuario_id = obterUsuarioId(req);

        if (!usuario_id) {
            return res.status(401).json({
                mensagem: 'Usuário não identificado'
            });
        }

        if (isNaN(partida_id)) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido'
            });
        }

        const partida = await PartidasModel.buscarPorId(partida_id);

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada'
            });
        }

        if (Number(partida.organizador_id) === Number(usuario_id)) {
            return res.status(400).json({
                mensagem: 'O organizador não pode solicitar participação na própria partida'
            });
        }

        if (Number(partida.vagas_disponiveis) <= 0) {
            return res.status(400).json({
                mensagem: 'Não existem vagas disponíveis'
            });
        }

        const participacao = await ParticipacoesModel.solicitar(
            partida_id,
            usuario_id
        );

        return res.status(201).json({
            mensagem: 'Solicitação enviada ao organizador',
            participacao
        });
    } catch (erro) {
        if (erro.code === '23505') {
            return res.status(409).json({
                mensagem: 'Você já solicitou participação nesta partida'
            });
        }

        return res.status(500).json({
            mensagem: 'Erro ao solicitar participação',
            erro: erro.message
        });
    }
}

async function aprovar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const organizador_id = obterUsuarioId(req);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido'
            });
        }

        if (!organizador_id) {
            return res.status(401).json({
                mensagem: 'Usuário não identificado'
            });
        }

        const participacao = await ParticipacoesModel.aprovar(
            id,
            organizador_id
        );

        return res.status(200).json({
            mensagem: 'Participação aprovada com sucesso',
            participacao
        });
    } catch (erro) {
        const erros = {
            PARTIDA_NAO_ENCONTRADA: [404, 'Partida não encontrada'],
            SEM_PERMISSAO: [403, 'Somente o organizador pode aprovar'],
            PARTICIPACAO_NAO_ENCONTRADA: [404, 'Participação não encontrada'],
            STATUS_INVALIDO: [400, 'Esta solicitação não está pendente'],
            PARTIDA_LOTADA: [400, 'Não existem vagas disponíveis']
        };

        if (erros[erro.message]) {
            const [status, mensagem] = erros[erro.message];

            return res.status(status).json({ mensagem });
        }

        return res.status(500).json({
            mensagem: 'Erro ao aprovar participação',
            erro: erro.message
        });
    }
}

async function rejeitar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const organizador_id = obterUsuarioId(req);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido'
            });
        }

        const participacao = await ParticipacoesModel.rejeitar(
            id,
            organizador_id
        );

        if (!participacao) {
            return res.status(404).json({
                mensagem: 'Solicitação não encontrada ou você não tem permissão'
            });
        }

        return res.status(200).json({
            mensagem: 'Solicitação rejeitada',
            participacao
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao rejeitar participação',
            erro: erro.message
        });
    }
}

async function cancelar(req, res) {
    try {
        const id = parseInt(req.params.id);
        const usuario_id = obterUsuarioId(req);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido'
            });
        }

        const participacao = await ParticipacoesModel.cancelar(
            id,
            usuario_id
        );

        if (!participacao) {
            return res.status(404).json({
                mensagem: 'Participação não encontrada ou não pode ser cancelada'
            });
        }

        return res.status(200).json({
            mensagem: 'Participação cancelada com sucesso',
            participacao
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao cancelar participação',
            erro: erro.message
        });
    }
}

module.exports = {
    listarPorPartida,
    listarPorUsuario,
    solicitar,
    aprovar,
    rejeitar,
    cancelar
};
