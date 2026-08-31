const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');

/**
 * @controller AuthController
 * @description Intercepta as requisições HTTP de autenticação: cadastro, login e logout,
 * gerenciando o hash de senhas (bcrypt) e a sessão do usuário (express-session).
 */
class AuthController {
  /**
   * Renderiza a tela de login.
   * @param {import('express').Request} req - Objeto de Requisição do Express.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {void} Renderiza a view `login`.
   */
  telaLogin(req, res) {
    res.render('login', { erro: null });
  }

  /**
   * Renderiza a tela de cadastro.
   * @param {import('express').Request} req - Objeto de Requisição do Express.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {void} Renderiza a view `cadastro`.
   */
  telaCadastro(req, res) {
    res.render('cadastro', { erro: null });
  }

  /**
   * Processa o cadastro de um novo usuário, aplicando hash na senha antes de salvar.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `nome`, `email`, `senha` e `tipo` em `req.body`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Redireciona para `/login` em caso de sucesso, ou renderiza o formulário com erro.
   */
  async cadastrar(req, res) {
    try {
      const { nome, email, senha, tipo } = req.body;

      if (!nome || !email || !senha) {
        return res.render('cadastro', { erro: 'Preencha todos os campos.' });
      }

      const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.render('cadastro', { erro: 'Este e-mail já está cadastrado.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      await UsuarioModel.criar({ nome, email, senhaHash, tipo });

      res.redirect('/login');
    } catch (erro) {
      console.error('[AuthController] cadastrar:', erro.message);
        res.render('cadastro', { erro: 'Erro ao cadastrar. Tente novamente.' });
    }
  }

  /**
   * Valida as credenciais do usuário (comparando a senha com o hash salvo via bcrypt.compare)
   * e cria a sessão do usuário logado.
   * @async
   * @param {import('express').Request} req - Objeto de Requisição do Express. Espera `email` e `senha` em `req.body`.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {Promise<void>} Redireciona para `/eventos` em caso de sucesso, ou renderiza o login com erro.
   */
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const usuario = await UsuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.render('login', { erro: 'E-mail ou senha inválidos.' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.render('login', { erro: 'E-mail ou senha inválidos.' });
      }

      req.session.user = {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      };

      res.redirect('/eventos');
    } catch (erro) {
      console.error('[AuthController] login:', erro.message);
      res.render('login', { erro: 'DEBUG: ' + (erro.code || 'SEM_CODIGO') + ' - ' + erro.message });
    }
  }

  /**
   * Destrói a sessão do usuário e limpa o cookie de sessão, efetuando o logout.
   * @param {import('express').Request} req - Objeto de Requisição do Express.
   * @param {import('express').Response} res - Objeto de Resposta do Express.
   * @returns {void} Redireciona para `/login` após destruir a sessão.
   */
  logout(req, res) {
    req.session.destroy((erro) => {
      if (erro) return res.status(500).send('Erro ao sair.');
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  }
}

module.exports = new AuthController();