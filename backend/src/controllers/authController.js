const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: 'E-mail e senha são obrigatórios'
    });
  }

  try {
    const resultado = await pool.query(
      'SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = $1',
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensagem: 'Credenciais inválidas'
      });
    }

    const usuario = resultado.rows[0];

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: 'Credenciais inválidas'
      });
    }

    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    };

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(
      payload,
      secret,
      {
        expiresIn: '2h'
      }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: 'Erro interno do servidor'
    });
  }
}

async function cadastro(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      mensagem: 'Nome, e-mail e senha são obrigatórios'
    });
  }

  try {
    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        mensagem: 'Este e-mail já está cadastrado'
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email, tipo`,
      [nome, email, senhaHash]
    );

    const usuario = resultado.rows[0];

    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    };

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(
      payload,
      secret,
      {
        expiresIn: '2h'
      }
    );

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      token,
      usuario
    });

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: 'Erro interno do servidor'
    });
  }
}

module.exports = {
  login,
  cadastro
};