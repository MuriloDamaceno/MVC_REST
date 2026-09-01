  /**
   * Busca um evento existente e renderiza o formulário em modo de edição.
   * Bloqueia o acesso caso o usuário logado não seja o organizador do evento.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `id` do evento em `req.params`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Renderiza a view `eventos/form` preenchida, ou responde 404/403/500 em caso de falha.
   */
  async telaEditar(req, res) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento) return res.status(404).send('Evento não encontrado.');

      if (evento.id_organizador !== req.session.user.id) {
        return res.status(403).render('erro', {
          mensagem: 'Você só pode editar eventos criados por você.',
          user: req.session.user
        });
      }

      res.render('eventos/form', { evento, erro: null, user: req.session.user });
    } catch (erro) {
      console.error('[EventoController] telaEditar:', erro.message);
      res.status(500).send('Erro ao carregar evento.');
    }
  }

  /**
   * Processa a atualização dos dados de um evento existente.
   * Bloqueia o acesso caso o usuário logado não seja o organizador do evento.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `id` em `req.params` e os novos dados em `req.body`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Redireciona para a tela de detalhes do evento em caso de sucesso.
   */
  async atualizar(req, res) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento) return res.status(404).send('Evento não encontrado.');

      if (evento.id_organizador !== req.session.user.id) {
        return res.status(403).render('erro', {
          mensagem: 'Você só pode editar eventos criados por você.',
          user: req.session.user
        });
      }

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
   * Bloqueia o acesso caso o usuário logado não seja o organizador do evento.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `id` do evento em `req.params`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Redireciona para `/eventos` após a exclusão.
   */
  async deletar(req, res) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento) return res.status(404).send('Evento não encontrado.');

      if (evento.id_organizador !== req.session.user.id) {
        return res.status(403).render('erro', {
          mensagem: 'Você só pode excluir eventos criados por você.',
          user: req.session.user
        });
      }

      await EventoModel.deletar(req.params.id);
      res.redirect('/eventos');
    } catch (erro) {
      console.error('[EventoController] deletar:', erro.message);
      res.status(500).send('Erro ao deletar evento.');
    }
  }