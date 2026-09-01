/**
 * Bloqueia o acesso a rotas exclusivas de organizador.
 * Deve ser usado sempre APÓS o authMiddleware, já que depende de req.session.user existir.
 */
function organizadorMiddleware(req, res, next) {
  if (req.session.user && req.session.user.tipo === 'organizador') {
    return next();
  }
  return res.status(403).render('erro', {
    mensagem: 'Apenas organizadores podem realizar esta ação.',
    user: req.session.user
  });
}

module.exports = organizadorMiddleware;