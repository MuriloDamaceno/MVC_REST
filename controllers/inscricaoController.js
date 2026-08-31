const InscricaoModel = require('../models/inscricaoModel');

/**
 * @controller InscricaoController
 * @description Intercepta as requisições HTTP relacionadas à inscrição de participantes em eventos.
 */
class InscricaoController {
  /**
   * Inscreve o usuário logado no evento informado, evitando inscrição duplicada.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `id` do evento em `req.params` e o usuário na sessão (`req.session.user`).
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Redireciona para a tela de detalhes do evento.
   */
  async inscrever(req, res) {
    try {
      const id_evento = req.params.id;
      const id_participante = req.session.user.id;

      const jaInscrito = await InscricaoModel.jaInscrito(id_evento, id_participante);
      if (jaInscrito) {
        return res.redirect('/eventos/' + id_evento);
      }

      await InscricaoModel.criar({ id_evento, id_participante });
      res.redirect('/eventos/' + id_evento);
    } catch (erro) {
      console.error('[InscricaoController] inscrever:', erro.message);
      res.status(500).send('Erro ao se inscrever no evento.');
    }
  }
}

module.exports = new InscricaoController();