const express = require('express');
const router = express.Router();
const clienteRoutes = require('./clienteRoutes');

router.use('/clientes', clienteRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'GABA API is running' });
});

module.exports = router;
