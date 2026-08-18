const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');

class AuthController {
  telaLogin(req, res) {
    res.render('login', { erro: null });
  }

  telaCadastro(req, res) {
    res.render('cadastro', { erro: null });
  }

  /**
   * Processa o cadastro de um novo usuário, aplicando hash na senha antes de salvar.
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
   * Valida as credenciais e cria a sessão do usuário logado.
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
      res.render('login', { erro: 'Erro ao processar login.' });
    }
  }

  logout(req, res) {
    req.session.destroy((erro) => {
      if (erro) return res.status(500).send('Erro ao sair.');
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  }
}

module.exports = new AuthController();