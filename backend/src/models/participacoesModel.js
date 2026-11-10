const pool = require('../config/database');

async function listarPorPartida(partida_id) {
    const result = await pool.query(`
        select
            pa.id,
            pa.partida_id,
            pa.usuario_id,
            u.nome as usuario,
            pa.status,
            pa.solicitado_em
        from participacoes pa
        inner join usuarios u
            on pa.usuario_id = u.id
        where pa.partida_id = $1
        order by pa.solicitado_em
    `, [partida_id]);

    return result.rows;
}

async function listarPorUsuario(usuario_id) {
    const result = await pool.query(`
        select
            pa.*,
            p.nome as partida,
            p.data,
            p.horario,
            p.local
        from participacoes pa
        inner join partidas p
            on pa.partida_id = p.id
        where pa.usuario_id = $1
        order by pa.solicitado_em desc
    `, [usuario_id]);

    return result.rows;
}

async function buscarPorId(id) {
    const result = await pool.query(
        'select * from participacoes where id = $1',
        [id]
    );

    return result.rows[0] || null;
}

async function solicitar(partida_id, usuario_id) {
    const result = await pool.query(`
        insert into participacoes (
            partida_id,
            usuario_id,
            status
        )
        values ($1, $2, 'pendente')
        returning *
    `, [partida_id, usuario_id]);

    return result.rows[0];
}

async function aprovar(id, organizador_id) {
    const client = await pool.connect();

    try {
        await client.query('begin');

        const partidaResult = await client.query(`
            select id, organizador_id, max_participantes
            from partidas
            where id = (
                select partida_id
                from participacoes
                where id = $1
            )
            for update
        `, [id]);

        const partida = partidaResult.rows[0];

        if (!partida) {
            throw new Error('PARTIDA_NAO_ENCONTRADA');
        }

        if (Number(partida.organizador_id) !== Number(organizador_id)) {
            throw new Error('SEM_PERMISSAO');
        }

        const participacaoResult = await client.query(`
            select *
            from participacoes
            where id = $1
            for update
        `, [id]);

        const participacao = participacaoResult.rows[0];

        if (!participacao) {
            throw new Error('PARTICIPACAO_NAO_ENCONTRADA');
        }

        if (participacao.status !== 'pendente') {
            throw new Error('STATUS_INVALIDO');
        }

        const totalResult = await client.query(`
            select count(*)::integer as total
            from participacoes
            where partida_id = $1
            and status = 'aprovado'
        `, [partida.id]);

        if (totalResult.rows[0].total >= partida.max_participantes) {
            throw new Error('PARTIDA_LOTADA');
        }

        const result = await client.query(`
            update participacoes
            set status = 'aprovado'
            where id = $1
            returning *
        `, [id]);

        await client.query('commit');

        return result.rows[0];
    } catch (erro) {
        await client.query('rollback');
        throw erro;
    } finally {
        client.release();
    }
}

async function rejeitar(id, organizador_id) {
    const result = await pool.query(`
        update participacoes pa
        set status = 'rejeitado'
        from partidas p
        where pa.id = $1
        and p.id = pa.partida_id
        and p.organizador_id = $2
        and pa.status = 'pendente'
        returning pa.*
    `, [id, organizador_id]);

    return result.rows[0] || null;
}

async function cancelar(id, usuario_id) {
    const result = await pool.query(`
        update participacoes
        set status = 'cancelado'
        where id = $1
        and usuario_id = $2
        and status in ('pendente', 'aprovado')
        returning *
    `, [id, usuario_id]);

    return result.rows[0] || null;
}

module.exports = {
    listarPorPartida,
    listarPorUsuario,
    buscarPorId,
    solicitar,
    aprovar,
    rejeitar,
    cancelar
};
