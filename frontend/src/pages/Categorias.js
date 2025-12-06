import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTag, FiEdit2, FiTrash2, FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { categoriaService } from '../services/api';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoriaId: null });
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriaService.getAll();
      setCategorias(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '' });
  };

  const handleEditClick = (categoria) => {
    setEditingId(categoria.id);
    setIsCreating(false);
    setFormData({ nombre: categoria.nombre, descripcion: categoria.descripcion || '' });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '' });
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isCreating) {
        const newCategoria = await categoriaService.create(formData);
        setCategorias([...categorias, newCategoria]);
      } else if (editingId) {
        const updatedCategoria = await categoriaService.update(editingId, formData);
        setCategorias(categorias.map(c => c.id === editingId ? updatedCategoria : c));
      }

      handleCancel();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la categoría');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, categoriaId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await categoriaService.delete(deleteModal.categoriaId);
      setCategorias(categorias.filter(c => c.id !== deleteModal.categoriaId));
      setDeleteModal({ isOpen: false, categoriaId: null });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar la categoría');
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/productos"
          className="text-gaba-primary hover:text-gaba-secondary inline-flex items-center gap-2 mb-4"
        >
          <FiArrowLeft size={20} />
          Volver a Productos
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiTag className="text-gaba-primary" />
              Categorías
            </h1>
            <p className="text-gray-500 mt-1">Organiza tus productos por categorías</p>
          </div>
          
          {!isCreating && !editingId && (
            <button
              onClick={handleCreateClick}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus size={20} />
              Nueva Categoría
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isCreating && (
        <div className="card mb-6 border-2 border-gaba-primary">
          <h3 className="text-lg font-semibold mb-4">Nueva Categoría</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="input-field"
                placeholder="Nombre de la categoría"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="input-field"
                placeholder="Descripción opcional"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <FiSave size={18} />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
              >
                <FiX size={18} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {categorias.length === 0 && !isCreating ? (
        <div className="card text-center py-12">
          <FiTag className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 mt-4">No hay categorías registradas</p>
          <button
            onClick={handleCreateClick}
            className="btn-primary inline-flex items-center gap-2 mt-4"
          >
            <FiPlus size={20} />
            Agregar primera categoría
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map(categoria => (
            <div key={categoria.id} className="card hover:shadow-lg transition-shadow duration-200 border-l-4 border-gaba-secondary">
              {editingId === categoria.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 text-sm"
                    >
                      <FiSave size={16} />
                      {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{categoria.nombre}</h3>
                    {categoria.descripcion && (
                      <p className="text-sm text-gray-500 mt-1">{categoria.descripcion}</p>
                    )}
                    <p className="text-xs text-gaba-primary mt-2">
                      {categoria.productos?.length || 0} productos
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(categoria)}
                      className="p-2 text-gaba-primary hover:bg-gaba-light rounded-lg transition-colors"
                      title="Editar"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(categoria.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoriaId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Categoría"
        message="¿Estás seguro de que deseas eliminar esta categoría? Solo se puede eliminar si no tiene productos asociados."
      />
    </div>
  );
};

export default Categorias;
