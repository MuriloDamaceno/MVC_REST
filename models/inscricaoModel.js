    const conexao = require('../config/database');

class InscricaoModel {
  static async criar({ id_evento, id_participante }) {
    const sql = 'INSERT INTO inscricoes (id_evento, id_participante) VALUES (?, ?)';
    const [resultado] = await conexao.execute(sql, [id_evento, id_participante]);
    return resultado.insertId;
  }

  static async listarPorEvento(id_evento) {
    const sql = `SELECT i.*, u.nome, u.email FROM inscricoes i
                 JOIN usuarios u ON u.id_usuario = i.id_participante
                 WHERE i.id_evento = ?`;
    const [linhas] = await conexao.execute(sql, [id_evento]);
    return linhas;
  }

  static async jaInscrito(id_evento, id_participante) {
    const sql = 'SELECT * FROM inscricoes WHERE id_evento = ? AND id_participante = ?';
    const [linhas] = await conexao.execute(sql, [id_evento, id_participante]);
    return linhas.length > 0;
  }
}

module.exports = InscricaoModel;