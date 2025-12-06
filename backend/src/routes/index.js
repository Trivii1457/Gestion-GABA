const express = require('express');
const router = express.Router();
const clienteRoutes = require('./clienteRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const productoRoutes = require('./productoRoutes');
const pedidoRoutes = require('./pedidoRoutes');
const abonoRoutes = require('./abonoRoutes');

router.use('/clientes', clienteRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/productos', productoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/abonos', abonoRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'GABA API is running' });
});

module.exports = router;
