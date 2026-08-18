const conexao = require('../config/database');

class EventoModel {
  static async criar({ titulo, descricao, data_evento, local_evento, id_organizador }) {
    const sql = `INSERT INTO eventos (titulo, descricao, data_evento, local_evento, id_organizador)
                 VALUES (?, ?, ?, ?, ?)`;
    const [resultado] = await conexao.execute(sql, [titulo, descricao, data_evento, local_evento, id_organizador]);
    return resultado.insertId;
  }

  static async listarTodos() {
    const sql = 'SELECT * FROM eventos ORDER BY data_evento ASC';
    const [linhas] = await conexao.execute(sql);
    return linhas;
  }

  static async buscarPorId(id) {
    const sql = 'SELECT * FROM eventos WHERE id_evento = ?';
    const [linhas] = await conexao.execute(sql, [id]);
    return linhas.length > 0 ? linhas[0] : null;
  }

  static async atualizar(id, { titulo, descricao, data_evento, local_evento }) {
    const sql = `UPDATE eventos SET titulo = ?, descricao = ?, data_evento = ?, local_evento = ?
                 WHERE id_evento = ?`;
    const [resultado] = await conexao.execute(sql, [titulo, descricao, data_evento, local_evento, id]);
    return resultado.affectedRows > 0;
  }

  static async deletar(id) {
    const sql = 'DELETE FROM eventos WHERE id_evento = ?';
    const [resultado] = await conexao.execute(sql, [id]);
    return resultado.affectedRows > 0;
  }
}

module.exports = EventoModel;