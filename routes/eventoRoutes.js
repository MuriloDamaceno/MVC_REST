const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const inscricaoController = require('../controllers/inscricaoController');
const organizadorMiddleware = require('../middlewares/organizadorMiddleware');

router.get('/', eventoController.listar);
router.get('/novo', organizadorMiddleware, eventoController.telaCriar);
router.post('/novo', organizadorMiddleware, eventoController.criar);

router.get('/:id', eventoController.detalhes);
router.get('/:id/editar', organizadorMiddleware, eventoController.telaEditar);
router.post('/:id/editar', organizadorMiddleware, eventoController.atualizar);
router.post('/:id/deletar', organizadorMiddleware, eventoController.deletar);

router.post('/:id/inscrever', inscricaoController.inscrever);

module.exports = router;