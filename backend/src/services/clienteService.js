const clienteRepository = require('../repositories/clienteRepository');

class ClienteService {
  async getAllClientes() {
    return await clienteRepository.findAll();
  }

  async getClienteById(id) {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return cliente;
  }

  async createCliente(clienteData) {
    // Check if identification already exists
    const existingCliente = await clienteRepository.findByIdentificacion(clienteData.identificacion);
    if (existingCliente) {
      throw new Error('Ya existe un cliente con esta identificación');
    }
    return await clienteRepository.create(clienteData);
  }

  async updateCliente(id, clienteData) {
    // Check if updating to an existing identification
    if (clienteData.identificacion) {
      const existingCliente = await clienteRepository.findByIdentificacion(clienteData.identificacion);
      if (existingCliente && existingCliente.id !== parseInt(id)) {
        throw new Error('Ya existe un cliente con esta identificación');
      }
    }
    
    const cliente = await clienteRepository.update(id, clienteData);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return cliente;
  }

  async deleteCliente(id) {
    const deleted = await clienteRepository.delete(id);
    if (!deleted) {
      throw new Error('Cliente no encontrado');
    }
    return true;
  }
}

module.exports = new ClienteService();
