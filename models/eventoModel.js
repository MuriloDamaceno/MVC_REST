const conexao = require('../config/database');

/**
 * @class EventoModel
 * @classdesc Gerencia as operações de persistência da entidade Evento no banco de dados MySQL (tabela `eventos`).
 */
class EventoModel {
  /**
   * Cria um novo evento no banco de dados.
   * @async
   * @method criar
   * @param {Object} dadosEvento - Dados do evento a ser criado.
   * @param {string} dadosEvento.titulo - Título do evento.
   * @param {string} dadosEvento.descricao - Descrição detalhada do evento.
   * @param {string} dadosEvento.data_evento - Data do evento no formato YYYY-MM-DD.
   * @param {string} dadosEvento.local_evento - Local onde o evento ocorrerá.
   * @param {number} dadosEvento.id_organizador - ID do usuário organizador (FK para `usuarios`).
   * @returns {Promise<number>} O ID (insertId) do evento recém-criado.
   * @throws {Error} Caso a query no MySQL falhe (ex: violação de chave estrangeira).
   */
  static async criar({ titulo, descricao, data_evento, local_evento, id_organizador }) {
    const sql = `INSERT INTO eventos (titulo, descricao, data_evento, local_evento, id_organizador)
                 VALUES (?, ?, ?, ?, ?)`;
    const [resultado] = await conexao.execute(sql, [titulo, descricao, data_evento, local_evento, id_organizador]);
    return resultado.insertId;
  }

  /**
   * Retorna todos os eventos cadastrados, ordenados pela data mais próxima.
   * @async
   * @method listarTodos
   * @returns {Promise<Array<Object>>} Lista de eventos.
   * @throws {Error} Caso a conexão com o MySQL falhe.
   */
  static async listarTodos() {
    const sql = 'SELECT * FROM eventos ORDER BY data_evento ASC';
    const [linhas] = await conexao.execute(sql);
    return linhas;
  }

  /**
   * Busca um único evento pelo seu ID.
   * @async
   * @method buscarPorId
   * @param {number} id - ID do evento.
   * @returns {Promise<Object|null>} O evento encontrado ou null se não existir.
   * @throws {Error} Caso a conexão com o MySQL falhe.
   */
  static async buscarPorId(id) {
    const sql = 'SELECT * FROM eventos WHERE id_evento = ?';
    const [linhas] = await conexao.execute(sql, [id]);
    return linhas.length > 0 ? linhas[0] : null;
  }

  /**
   * Atualiza os dados de um evento existente.
   * @async
   * @method atualizar
   * @param {number} id - ID do evento a ser atualizado.
   * @param {Object} dadosEvento - Novos dados do evento.
   * @param {string} dadosEvento.titulo - Título atualizado.
   * @param {string} dadosEvento.descricao - Descrição atualizada.
   * @param {string} dadosEvento.data_evento - Data atualizada.
   * @param {string} dadosEvento.local_evento - Local atualizado.
   * @returns {Promise<boolean>} true se alguma linha foi alterada no banco.
   * @throws {Error} Caso a conexão com o MySQL falhe.
   */
  static async atualizar(id, { titulo, descricao, data_evento, local_evento }) {
    const sql = `UPDATE eventos SET titulo = ?, descricao = ?, data_evento = ?, local_evento = ?
                 WHERE id_evento = ?`;
    const [resultado] = await conexao.execute(sql, [titulo, descricao, data_evento, local_evento, id]);
    return resultado.affectedRows > 0;
  }

  /**
   * Remove um evento do banco de dados.
   * @async
   * @method deletar
   * @param {number} id - ID do evento a ser removido.
   * @returns {Promise<boolean>} true se o evento foi deletado com sucesso.
   * @throws {Error} Caso a conexão com o MySQL falhe.
   */
  static async deletar(id) {
    const sql = 'DELETE FROM eventos WHERE id_evento = ?';
    const [resultado] = await conexao.execute(sql, [id]);
    return resultado.affectedRows > 0;
  }
}

module.exports = EventoModel;