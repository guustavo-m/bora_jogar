const pool = require('../config/database');

async function listarTodos() {
    const result = await pool.query(`
        select *
        from esportes
        order by nome
    `);

    return result.rows;
}

async function buscarPorId(id) {
    const result = await pool.query(
        'select * from esportes where id = $1',
        [id]
    );

    return result.rows[0] || null;
}

async function criar(nome) {
    const result = await pool.query(`
        insert into esportes (nome)
        values ($1)
        returning *
    `, [nome]);

    return result.rows[0];
}

async function deletar(id) {
    const result = await pool.query(
        'delete from esportes where id = $1',
        [id]
    );

    return result.rowCount > 0;
}

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    deletar
};
