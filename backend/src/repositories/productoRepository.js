const { Producto, Categoria } = require('../models');

class ProductoRepository {
  async findAll() {
    return await Producto.findAll({
      order: [['nombre', 'ASC']],
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }]
    });
  }

  async findById(id) {
    return await Producto.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'categoria'
      }]
    });
  }

  async findBySku(sku) {
    return await Producto.findOne({
      where: { sku }
    });
  }

  async findByCategoria(categoriaId) {
    return await Producto.findAll({
      where: { categoria_id: categoriaId },
      order: [['nombre', 'ASC']],
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }]
    });
  }

  async create(productoData) {
    return await Producto.create(productoData);
  }

  async update(id, productoData) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return null;
    }
    return await producto.update(productoData);
  }

  async updateStock(id, cantidad) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return null;
    }
    const nuevoStock = producto.stock + cantidad;
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }
    return await producto.update({ stock: nuevoStock });
  }

  async delete(id) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return false;
    }
    await producto.destroy();
    return true;
  }
}

module.exports = new ProductoRepository();
