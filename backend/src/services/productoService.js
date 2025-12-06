const productoRepository = require('../repositories/productoRepository');
const categoriaRepository = require('../repositories/categoriaRepository');

class ProductoService {
  async getAllProductos() {
    return await productoRepository.findAll();
  }

  async getProductoById(id) {
    const producto = await productoRepository.findById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async getProductosByCategoria(categoriaId) {
    return await productoRepository.findByCategoria(categoriaId);
  }

  async createProducto(productoData) {
    const existingProducto = await productoRepository.findBySku(productoData.sku);
    if (existingProducto) {
      throw new Error('Ya existe un producto con este SKU');
    }

    if (productoData.categoria_id) {
      const categoria = await categoriaRepository.findById(productoData.categoria_id);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
    }

    return await productoRepository.create(productoData);
  }

  async updateProducto(id, productoData) {
    if (productoData.sku) {
      const existingProducto = await productoRepository.findBySku(productoData.sku);
      if (existingProducto && existingProducto.id !== parseInt(id)) {
        throw new Error('Ya existe un producto con este SKU');
      }
    }

    if (productoData.categoria_id) {
      const categoria = await categoriaRepository.findById(productoData.categoria_id);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
    }

    const producto = await productoRepository.update(id, productoData);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async updateStock(id, cantidad) {
    const producto = await productoRepository.updateStock(id, cantidad);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async deleteProducto(id) {
    const deleted = await productoRepository.delete(id);
    if (!deleted) {
      throw new Error('Producto no encontrado');
    }
    return true;
  }
}

module.exports = new ProductoService();
