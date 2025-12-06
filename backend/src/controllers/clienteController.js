const clienteService = require('../services/clienteService');

class ClienteController {
  async getAll(req, res) {
    try {
      const clientes = await clienteService.getAllClientes();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const cliente = await clienteService.getClienteById(req.params.id);
      res.json(cliente);
    } catch (error) {
      if (error.message === 'Cliente no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const cliente = await clienteService.createCliente(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      if (error.message === 'Ya existe un cliente con esta identificación') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const cliente = await clienteService.updateCliente(req.params.id, req.body);
      res.json(cliente);
    } catch (error) {
      if (error.message === 'Cliente no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Ya existe un cliente con esta identificación') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await clienteService.deleteCliente(req.params.id);
      res.json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
      if (error.message === 'Cliente no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ClienteController();
