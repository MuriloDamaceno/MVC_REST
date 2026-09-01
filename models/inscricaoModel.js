const conexao = require('../config/database');

/**
 * @class InscricaoModel
 * @classdesc Gerencia as operações de persistência da entidade Inscrição no banco de dados MySQL (tabela `inscricoes`),
 * representando o vínculo entre um participante e um evento.
 */
class InscricaoModel {
  /**
   * Cria uma nova inscrição, vinculando um participante a um evento.
   * @async
   * @method criar
   * @param {Object} dadosInscricao - Dados da inscrição.
   * @param {number} dadosInscricao.id_evento - ID do evento (FK para `eventos`).
   * @param {number} dadosInscricao.id_participante - ID do usuário participante (FK para `usuarios`).
   * @returns {Promise<number>} O ID (insertId) da inscrição recém-criada.
   * @throws {Error} Caso a conexão com o MySQL falhe ou haja violação de chave estrangeira.
   */
  static async criar({ id_evento, id_participante }) {
    const sql = 'INSERT INTO inscricoes (id_evento, id_participante) VALUES (?, ?)';
    const [resultado] = await conexao.execute(sql, [id_evento, id_participante]);
    return resultado.insertId;
  }

  /**
   * Lista todos os participantes inscritos em um evento específico, incluindo nome e e-mail.
   * @async
   * @method listarPorEvento
   * @param {number} id_evento - ID do evento.
   * @returns {Promise<Array<Object>>} Lista de inscrições com dados do participante (nome, email).
   * @throws {Error} Caso a conexão com o MySQL falhe.
   */
  static async listarPorEvento(id_evento) {
    const sql = `SELECT i.*, u.nome, u.email FROM inscricoes i
                 JOIN usuarios u ON u.id_usuario = i.id_participante
                 WHERE i.id_evento = ?`;
    const [linhas] = await conexao.execute(sql, [id_evento]);
    return linhas;
  }

  /**
   * Verifica se um participante já está inscrito em um evento, evitando inscrições duplicadas.
   * @async
   * @method jaInscrito
   * @param {number} id_evento - ID do evento.
   * @param {number} id_participante - ID do usuário participante.
   * @returns {Promise<boolean>} true se o participante já estiver inscrito no evento.
   * @throws {Error} Caso a conexão com o MySQL falhe.
   */
  static async jaInscrito(id_evento, id_participante) {
    const sql = 'SELECT * FROM inscricoes WHERE id_evento = ? AND id_participante = ?';
    const [linhas] = await conexao.execute(sql, [id_evento, id_participante]);
    return linhas.length > 0;
  }
}

module.exports = InscricaoModel;