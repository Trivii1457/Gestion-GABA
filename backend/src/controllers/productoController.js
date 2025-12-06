const productoService = require('../services/productoService');

class ProductoController {
  async getAll(req, res) {
    try {
      const productos = await productoService.getAllProductos();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const producto = await productoService.getProductoById(req.params.id);
      res.json(producto);
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getByCategoria(req, res) {
    try {
      const productos = await productoService.getProductosByCategoria(req.params.categoriaId);
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const producto = await productoService.createProducto(req.body);
      res.status(201).json(producto);
    } catch (error) {
      if (error.message === 'Ya existe un producto con este SKU' || 
          error.message === 'Categoría no encontrada') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const producto = await productoService.updateProducto(req.params.id, req.body);
      res.json(producto);
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Ya existe un producto con este SKU' ||
          error.message === 'Categoría no encontrada') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async updateStock(req, res) {
    try {
      const { cantidad } = req.body;
      if (cantidad === undefined || cantidad === null) {
        return res.status(400).json({ error: 'La cantidad es requerida' });
      }
      const producto = await productoService.updateStock(req.params.id, cantidad);
      res.json(producto);
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Stock insuficiente') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await productoService.deleteProducto(req.params.id);
      res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductoController();
