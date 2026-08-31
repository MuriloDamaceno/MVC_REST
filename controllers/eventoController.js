const EventoModel = require('../models/eventoModel');
const InscricaoModel = require('../models/inscricaoModel');

/**
 * @controller EventoController
 * @description Intercepta as requisições HTTP relacionadas a eventos (listagem, criação, edição, exclusão e detalhes)
 * e orquestra as respostas, delegando a persistência ao EventoModel.
 */
class EventoController {
  /**
   * Lista todos os eventos cadastrados e renderiza a tela de listagem.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Renderiza a view `eventos/lista` com a lista de eventos.
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

  /**
   * Renderiza o formulário de criação de um novo evento.
   * @param {import('express').Request} req - Objeto de Requisição do Express.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {void} Renderiza a view `eventos/form` em modo de criação.
   */
  telaCriar(req, res) {
    res.render('eventos/form', { evento: null, erro: null, user: req.session.user });
  }

  /**
   * Processa a criação de um novo evento, vinculando-o ao usuário organizador da sessão atual.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `titulo`, `descricao`, `data_evento` e `local_evento` em `req.body`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Redireciona para `/eventos` em caso de sucesso, ou renderiza o formulário com erro.
   */
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

  /**
   * Busca e exibe os detalhes de um evento específico, incluindo se o usuário logado já está inscrito.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `id` do evento em `req.params`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Renderiza a view `eventos/detalhes`, ou responde 404/500 em caso de falha.
   */
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

  /**
   * Busca um evento existente e renderiza o formulário em modo de edição.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `id` do evento em `req.params`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Renderiza a view `eventos/form` preenchida, ou responde 404/500 em caso de falha.
   */
  async telaEditar(req, res) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento) return res.status(404).send('Evento não encontrado.');
      res.render('eventos/form', { evento, erro: null, user: req.session.user });
    } catch (erro) {
      res.status(500).send('Erro ao carregar evento.');
    }
  }

  /**
   * Processa a atualização dos dados de um evento existente.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `id` em `req.params` e os novos dados em `req.body`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Redireciona para a tela de detalhes do evento em caso de sucesso.
   */
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

  /**
   * Remove um evento do banco de dados.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `id` do evento em `req.params`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Redireciona para `/eventos` após a exclusão.
   */
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