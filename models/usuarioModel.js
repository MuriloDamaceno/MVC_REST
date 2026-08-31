const conexao = require('../config/database');

/**
 * @class UsuarioModel
 * @classdesc Gerencia as operações de persistência da entidade Usuário no banco de dados MySQL (tabela `usuarios`).
 */
class UsuarioModel {
  /**
   * Cria um novo usuário no banco de dados. A senha já deve chegar em formato hash (bcrypt).
   * @async
   * @method criar
   * @param {Object} dadosUsuario - Dados do usuário.
   * @param {string} dadosUsuario.nome - Nome completo do usuário.
   * @param {string} dadosUsuario.email - E-mail único do usuário.
   * @param {string} dadosUsuario.senhaHash - Senha já criptografada com bcrypt.
   * @param {string} [dadosUsuario.tipo='participante'] - Tipo do usuário: 'participante' ou 'organizador'.
   * @returns {Promise<number>} O ID (insertId) do usuário recém-criado.
   * @throws {Error} Caso o e-mail já exista (violação de UNIQUE KEY) ou a conexão falhe.
   */
  static async criar({ nome, email, senhaHash, tipo }) {
    const sql = 'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
    const [resultado] = await conexao.execute(sql, [nome, email, senhaHash, tipo || 'participante']);
    return resultado.insertId;
  }

  /**
   * Busca um usuário pelo e-mail, retornando todos os campos (incluindo o hash da senha).
   * Usado exclusivamente no fluxo de login para comparação com bcrypt.compare.
   * @async
   * @method buscarPorEmail
   * @param {string} email - E-mail do usuário.
   * @returns {Promise<Object|null>} O usuário encontrado (com senha em hash) ou null.
   * @throws {Error} Caso a conexão com o MySQL falhe.
   */
  static async buscarPorEmail(email) {
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    const [linhas] = await conexao.execute(sql, [email]);
    return linhas.length > 0 ? linhas[0] : null;
  }

  /**
   * Busca um usuário pelo ID, sem retornar o campo de senha.
   * @async
   * @method buscarPorId
   * @param {number} id - ID do usuário.
   * @returns {Promise<Object|null>} O usuário encontrado (sem senha) ou null.
   * @throws {Error} Caso a conexão com o MySQL falhe.
   */
  static async buscarPorId(id) {
    const sql = 'SELECT id_usuario, nome, email, tipo FROM usuarios WHERE id_usuario = ?';
    const [linhas] = await conexao.execute(sql, [id]);
    return linhas.length > 0 ? linhas[0] : null;
  }
}

module.exports = UsuarioModel;