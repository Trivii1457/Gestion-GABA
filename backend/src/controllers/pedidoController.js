const pedidoService = require('../services/pedidoService');

class PedidoController {
  async getAll(req, res) {
    try {
      const pedidos = await pedidoService.getAllPedidos();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const pedido = await pedidoService.getPedidoById(req.params.id);
      res.json(pedido);
    } catch (error) {
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getByCliente(req, res) {
    try {
      const pedidos = await pedidoService.getPedidosByCliente(req.params.clienteId);
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByEstado(req, res) {
    try {
      const pedidos = await pedidoService.getPedidosByEstado(req.params.estado);
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const { detalles, ...pedidoData } = req.body;
      
      if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
        return res.status(400).json({ error: 'El pedido debe tener al menos un producto' });
      }

      const pedido = await pedidoService.createPedido(pedidoData, detalles);
      res.status(201).json(pedido);
    } catch (error) {
      if (error.message === 'Cliente no encontrado' ||
          error.message.includes('no encontrado') ||
          error.message.includes('Stock insuficiente')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const pedido = await pedidoService.updatePedido(req.params.id, req.body);
      res.json(pedido);
    } catch (error) {
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async updateEstado(req, res) {
    try {
      const { estado } = req.body;
      if (!estado) {
        return res.status(400).json({ error: 'El estado es requerido' });
      }
      const pedido = await pedidoService.updateEstado(req.params.id, estado);
      res.json(pedido);
    } catch (error) {
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await pedidoService.deletePedido(req.params.id);
      res.json({ message: 'Pedido eliminado exitosamente' });
    } catch (error) {
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getReporteFinanciero(req, res) {
    try {
      const reporte = await pedidoService.getReporteFinanciero();
      res.json(reporte);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PedidoController();
