const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.getAll);
router.get('/reporte', pedidoController.getReporteFinanciero);
router.get('/cliente/:clienteId', pedidoController.getByCliente);
router.get('/estado/:estado', pedidoController.getByEstado);
router.get('/:id', pedidoController.getById);
router.post('/', pedidoController.create);
router.put('/:id', pedidoController.update);
router.patch('/:id/estado', pedidoController.updateEstado);
router.delete('/:id', pedidoController.delete);

module.exports = router;
