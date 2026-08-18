const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const inscricaoController = require('../controllers/inscricaoController');

router.get('/', eventoController.listar);
router.get('/novo', eventoController.telaCriar);
router.post('/novo', eventoController.criar);

router.get('/:id', eventoController.detalhes);
router.get('/:id/editar', eventoController.telaEditar);
router.post('/:id/editar', eventoController.atualizar);
router.post('/:id/deletar', eventoController.deletar);

router.post('/:id/inscrever', inscricaoController.inscrever);

module.exports = router;