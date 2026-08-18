const InscricaoModel = require('../models/inscricaoModel');

class InscricaoController {
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