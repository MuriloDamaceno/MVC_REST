/**
 * Bloqueia o acesso a rotas privadas se o usuário não estiver logado.
 */
function authMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

module.exports = authMiddleware;