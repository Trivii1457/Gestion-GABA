const express = require('express');
const router = express.Router();
const abonoController = require('../controllers/abonoController');

router.get('/', abonoController.getAll);
router.get('/pedido/:pedidoId', abonoController.getByPedido);
router.get('/:id', abonoController.getById);
router.post('/', abonoController.create);
router.put('/:id', abonoController.update);
router.delete('/:id', abonoController.delete);

module.exports = router;
