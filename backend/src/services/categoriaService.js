const categoriaRepository = require('../repositories/categoriaRepository');

class CategoriaService {
  async getAllCategorias() {
    return await categoriaRepository.findAll();
  }

  async getCategoriaById(id) {
    const categoria = await categoriaRepository.findById(id);
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    return categoria;
  }

  async createCategoria(categoriaData) {
    const existingCategoria = await categoriaRepository.findByNombre(categoriaData.nombre);
    if (existingCategoria) {
      throw new Error('Ya existe una categoría con este nombre');
    }
    return await categoriaRepository.create(categoriaData);
  }

  async updateCategoria(id, categoriaData) {
    if (categoriaData.nombre) {
      const existingCategoria = await categoriaRepository.findByNombre(categoriaData.nombre);
      if (existingCategoria && existingCategoria.id !== parseInt(id)) {
        throw new Error('Ya existe una categoría con este nombre');
      }
    }
    
    const categoria = await categoriaRepository.update(id, categoriaData);
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    return categoria;
  }

  async deleteCategoria(id) {
    const categoria = await categoriaRepository.findById(id);
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    
    if (categoria.productos && categoria.productos.length > 0) {
      throw new Error('No se puede eliminar una categoría con productos asociados');
    }
    
    const deleted = await categoriaRepository.delete(id);
    if (!deleted) {
      throw new Error('Categoría no encontrada');
    }
    return true;
  }
}

module.exports = new CategoriaService();
