const categoriaService = require('../services/categoriaService');

class CategoriaController {
  async getAll(req, res) {
    try {
      const categorias = await categoriaService.getAllCategorias();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const categoria = await categoriaService.getCategoriaById(req.params.id);
      res.json(categoria);
    } catch (error) {
      if (error.message === 'Categoría no encontrada') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const categoria = await categoriaService.createCategoria(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      if (error.message === 'Ya existe una categoría con este nombre') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const categoria = await categoriaService.updateCategoria(req.params.id, req.body);
      res.json(categoria);
    } catch (error) {
      if (error.message === 'Categoría no encontrada') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Ya existe una categoría con este nombre') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await categoriaService.deleteCategoria(req.params.id);
      res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
      if (error.message === 'Categoría no encontrada') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'No se puede eliminar una categoría con productos asociados') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoriaController();
