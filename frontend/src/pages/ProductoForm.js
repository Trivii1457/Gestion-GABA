import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { productoService, categoriaService } from '../services/api';
import Loading from '../components/Loading';

const ProductoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    sku: '',
    precio: '',
    stock: '0',
    categoria_id: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategorias();
    if (isEditing) {
      fetchProducto();
    }
  }, [id]);

  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const fetchProducto = async () => {
    try {
      setLoading(true);
      const data = await productoService.getById(id);
      setFormData({
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        sku: data.sku || '',
        precio: data.precio?.toString() || '',
        stock: data.stock?.toString() || '0',
        categoria_id: data.categoria_id?.toString() || ''
      });
    } catch (err) {
      setError('Error al cargar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.sku.trim() || !formData.precio) {
      setError('El nombre, SKU y precio son obligatorios');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const dataToSend = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : null
      };
      
      if (isEditing) {
        await productoService.update(id, dataToSend);
      } else {
        await productoService.create(dataToSend);
      }
      
      navigate('/productos');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el producto');
      console.error(err);
    } finally {
      setSaving(false);
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
        
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FiPackage className="text-gaba-primary" />
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEditing ? 'Modifica la información del producto' : 'Ingresa los datos del nuevo producto'}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card max-w-2xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-field"
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU/Código <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: GORRO-001"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Descripción del producto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                Precio <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="input-field"
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Inicial
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="input-field"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Sin categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <FiSave size={20} />
            {saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
          </button>
          
          <Link
            to="/productos"
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductoForm;
