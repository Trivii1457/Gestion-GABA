const { Categoria, Producto } = require('../models');

class CategoriaRepository {
  async findAll() {
    return await Categoria.findAll({
      order: [['nombre', 'ASC']],
      include: [{
        model: Producto,
        as: 'productos',
        attributes: ['id']
      }]
    });
  }

  async findById(id) {
    return await Categoria.findByPk(id, {
      include: [{
        model: Producto,
        as: 'productos'
      }]
    });
  }

  async findByNombre(nombre) {
    return await Categoria.findOne({
      where: { nombre }
    });
  }

  async create(categoriaData) {
    return await Categoria.create(categoriaData);
  }

  async update(id, categoriaData) {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return null;
    }
    return await categoria.update(categoriaData);
  }

  async delete(id) {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return false;
    }
    await categoria.destroy();
    return true;
  }
}

module.exports = new CategoriaRepository();
