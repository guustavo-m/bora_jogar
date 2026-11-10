const pool = require('../config/database');

async function listarTodos() {
    const result = await pool.query(`
        select
            p.*,
            e.nome as esporte,
            u.nome as organizador,
            count(pa.id) filter (
                where pa.status = 'aprovado'
            ) as participantes_confirmados,
            p.max_participantes - count(pa.id) filter (
                where pa.status = 'aprovado'
            ) as vagas_disponiveis
        from partidas p
        inner join esportes e
            on p.esporte_id = e.id
        inner join usuarios u
            on p.organizador_id = u.id
        left join participacoes pa
            on p.id = pa.partida_id
        group by p.id, e.nome, u.nome
        order by p.data, p.horario
    `);

    return result.rows;
}

async function buscarPorId(id) {
    const result = await pool.query(`
        select
            p.*,
            e.nome as esporte,
            u.nome as organizador,
            count(pa.id) filter (
                where pa.status = 'aprovado'
            ) as participantes_confirmados,
            p.max_participantes - count(pa.id) filter (
                where pa.status = 'aprovado'
            ) as vagas_disponiveis
        from partidas p
        inner join esportes e
            on p.esporte_id = e.id
        inner join usuarios u
            on p.organizador_id = u.id
        left join participacoes pa
            on p.id = pa.partida_id
        where p.id = $1
        group by p.id, e.nome, u.nome
    `, [id]);

    return result.rows[0] || null;
}

async function criar(dados) {
    const {
        nome,
        esporte_id,
        organizador_id,
        data,
        horario,
        local,
        max_participantes,
        descricao
    } = dados;

    const result = await pool.query(`
        insert into partidas (
            nome,
            esporte_id,
            organizador_id,
            data,
            horario,
            local,
            max_participantes,
            descricao
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        returning *
    `, [
        nome,
        esporte_id,
        organizador_id,
        data,
        horario,
        local,
        max_participantes,
        descricao
    ]);

    return result.rows[0];
}

async function atualizar(id, dados) {
    const {
        nome,
        esporte_id,
        data,
        horario,
        local,
        max_participantes,
        descricao
    } = dados;

    const result = await pool.query(`
        update partidas
        set
            nome = $1,
            esporte_id = $2,
            data = $3,
            horario = $4,
            local = $5,
            max_participantes = $6,
            descricao = $7
        where id = $8
        returning *
    `, [
        nome,
        esporte_id,
        data,
        horario,
        local,
        max_participantes,
        descricao,
        id
    ]);

    return result.rows[0] || null;
}

async function deletar(id) {
    const result = await pool.query(
        'delete from partidas where id = $1',
        [id]
    );

    return result.rowCount > 0;
}

async function buscarParticipantes(id) {
    const result = await pool.query(`
        select
            u.id,
            u.nome,
            pa.status,
            pa.solicitado_em
        from participacoes pa
        inner join usuarios u
            on pa.usuario_id = u.id
        where pa.partida_id = $1
        and pa.status = 'aprovado'
        order by u.nome
    `, [id]);

    return result.rows;
}

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    atualizar,
    deletar,
    buscarParticipantes
};
