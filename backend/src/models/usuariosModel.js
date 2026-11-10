const pool = require('../config/database');

async function listarTodos() {
  const result = await pool.query(
    `
      SELECT id, nome, email, tipo
      FROM usuarios
      ORDER BY id
    `
  );

  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(
    `
      SELECT id, nome, email, tipo
      FROM usuarios
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

async function atualizar(id, dados) {
  const { nome, email, tipo } = dados;

  const sql = `
    UPDATE usuarios
    SET
      nome = $1,
      email = $2,
      tipo = $3
    WHERE id = $4
    RETURNING id, nome, email, tipo
  `;

  const result = await pool.query(
    sql,
    [
      nome,
      email,
      tipo,
      id
    ]
  );

  return result.rows[0] || null;
}

async function deletar(id) {
  const result = await pool.query(
    'DELETE FROM usuarios WHERE id = $1',
    [id]
  );

  return result.rowCount > 0;
}

module.exports = {
  listarTodos,
  buscarPorId,
  atualizar,
  deletar
};
