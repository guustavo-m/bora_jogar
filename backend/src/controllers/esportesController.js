const EsportesModel = require('../models/esportesModel');

async function listarTodos(req, res) {
    try {
        const esportes = await EsportesModel.listarTodos();

        return res.status(200).json(esportes);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao listar esportes',
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

        const esporte = await EsportesModel.buscarPorId(id);

        if (!esporte) {
            return res.status(404).json({
                mensagem: 'Esporte não encontrado'
            });
        }

        return res.status(200).json(esporte);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao buscar esporte',
            erro: erro.message
        });
    }
}

async function criar(req, res) {
    try {
        const { nome } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({
                mensagem: 'O nome do esporte é obrigatório'
            });
        }

        const novoEsporte = await EsportesModel.criar(nome.trim());

        return res.status(201).json(novoEsporte);
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao criar esporte',
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

        const deletado = await EsportesModel.deletar(id);

        if (!deletado) {
            return res.status(404).json({
                mensagem: 'Esporte não encontrado'
            });
        }

        return res.status(200).json({
            mensagem: 'Esporte removido com sucesso'
        });
    } catch (erro) {
        return res.status(500).json({
            mensagem: 'Erro ao deletar esporte',
            erro: erro.message
        });
    }
}

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    deletar
};
