const EventoModel = require('../models/eventoModel');
const InscricaoModel = require('../models/inscricaoModel');

class EventoController {
  /**
   * Lista todos os eventos cadastrados.
   */
  async listar(req, res) {
    try {
      const eventos = await EventoModel.listarTodos();
      res.render('eventos/lista', { eventos, user: req.session.user });
    } catch (erro) {
      console.error('[EventoController] listar:', erro.message);
      res.status(500).send('Erro ao carregar eventos.');
    }
  }

  telaCriar(req, res) {
    res.render('eventos/form', { evento: null, erro: null });
  }

  async criar(req, res) {
    try {
      const { titulo, descricao, data_evento, local_evento } = req.body;
      await EventoModel.criar({
        titulo,
        descricao,
        data_evento,
        local_evento,
        id_organizador: req.session.user.id
      });
      res.redirect('/eventos');
    } catch (erro) {
      console.error('[EventoController] criar:', erro.message);
      res.render('eventos/form', { evento: null, erro: 'Erro ao criar evento.' });
    }
  }

  async detalhes(req, res) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento) return res.status(404).send('Evento não encontrado.');

      const jaInscrito = await InscricaoModel.jaInscrito(evento.id_evento, req.session.user.id);
      res.render('eventos/detalhes', { evento, jaInscrito, user: req.session.user });
    } catch (erro) {
      console.error('[EventoController] detalhes:', erro.message);
      res.status(500).send('Erro ao carregar evento.');
    }
  }

  async telaEditar(req, res) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento) return res.status(404).send('Evento não encontrado.');
      res.render('eventos/form', { evento, erro: null });
    } catch (erro) {
      res.status(500).send('Erro ao carregar evento.');
    }
  }

  async atualizar(req, res) {
    try {
      const { titulo, descricao, data_evento, local_evento } = req.body;
      await EventoModel.atualizar(req.params.id, { titulo, descricao, data_evento, local_evento });
      res.redirect('/eventos/' + req.params.id);
    } catch (erro) {
      console.error('[EventoController] atualizar:', erro.message);
      res.status(500).send('Erro ao atualizar evento.');
    }
  }

  async deletar(req, res) {
    try {
      await EventoModel.deletar(req.params.id);
      res.redirect('/eventos');
    } catch (erro) {
      console.error('[EventoController] deletar:', erro.message);
      res.status(500).send('Erro ao deletar evento.');
    }
  }
}

module.exports = new EventoController();