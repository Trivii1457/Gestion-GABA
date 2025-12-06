const abonoService = require('../services/abonoService');

class AbonoController {
  async getAll(req, res) {
    try {
      const abonos = await abonoService.getAllAbonos();
      res.json(abonos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const abono = await abonoService.getAbonoById(req.params.id);
      res.json(abono);
    } catch (error) {
      if (error.message === 'Abono no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getByPedido(req, res) {
    try {
      const abonos = await abonoService.getAbonosByPedido(req.params.pedidoId);
      res.json(abonos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const abono = await abonoService.createAbono(req.body);
      res.status(201).json(abono);
    } catch (error) {
      if (error.message === 'Pedido no encontrado' ||
          error.message.includes('excede el saldo pendiente')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const abono = await abonoService.updateAbono(req.params.id, req.body);
      res.json(abono);
    } catch (error) {
      if (error.message === 'Abono no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await abonoService.deleteAbono(req.params.id);
      res.json({ message: 'Abono eliminado exitosamente' });
    } catch (error) {
      if (error.message === 'Abono no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AbonoController();
