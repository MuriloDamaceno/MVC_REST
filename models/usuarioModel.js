const conexao = require('../config/database');

class UsuarioModel {
  static async criar({ nome, email, senhaHash, tipo }) {
    const sql = 'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
    const [resultado] = await conexao.execute(sql, [nome, email, senhaHash, tipo || 'participante']);
    return resultado.insertId;
  }

  static async buscarPorEmail(email) {
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    const [linhas] = await conexao.execute(sql, [email]);
    return linhas.length > 0 ? linhas[0] : null;
  }

  static async buscarPorId(id) {
    const sql = 'SELECT id_usuario, nome, email, tipo FROM usuarios WHERE id_usuario = ?';
    const [linhas] = await conexao.execute(sql, [id]);
    return linhas.length > 0 ? linhas[0] : null;
  }
}

module.exports = UsuarioModel;