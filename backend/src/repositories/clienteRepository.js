const Cliente = require('../models/Cliente');

class ClienteRepository {
  async findAll() {
    return await Cliente.findAll({
      order: [['created_at', 'DESC']]
    });
  }

  async findById(id) {
    return await Cliente.findByPk(id);
  }

  async findByIdentificacion(identificacion) {
    return await Cliente.findOne({
      where: { identificacion }
    });
  }

  async create(clienteData) {
    return await Cliente.create(clienteData);
  }

  async update(id, clienteData) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return null;
    }
    return await cliente.update(clienteData);
  }

  async delete(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return false;
    }
    await cliente.destroy();
    return true;
  }
}

module.exports = new ClienteRepository();
