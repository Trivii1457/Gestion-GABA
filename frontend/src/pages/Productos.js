import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiPackage, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { productoService, categoriaService } from '../services/api';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const Productos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productoId: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        productoService.getAll(),
        categoriaService.getAll()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/productos/editar/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, productoId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await productoService.delete(deleteModal.productoId);
      setProductos(productos.filter(p => p.id !== deleteModal.productoId));
      setDeleteModal({ isOpen: false, productoId: null });
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error(err);
    }
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = categoriaFilter === '' || 
      (producto.categoria_id && producto.categoria_id.toString() === categoriaFilter);
    return matchesSearch && matchesCategoria;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiPackage className="text-gaba-primary" />
            Productos
          </h1>
          <p className="text-gray-500 mt-1">Gestiona el inventario de productos</p>
        </div>
        
        <div className="flex gap-2">
          <Link
            to="/categorias"
            className="btn-secondary flex items-center gap-2"
          >
            Categorías
          </Link>
          <Link
            to="/productos/nuevo"
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus size={20} />
            Nuevo Producto
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="input-field sm:w-64"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      {filteredProductos.length === 0 ? (
        <div className="card text-center py-12">
          <FiPackage className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 mt-4">
            {searchTerm || categoriaFilter ? 'No se encontraron productos' : 'No hay productos registrados'}
          </p>
          {!searchTerm && !categoriaFilter && (
            <Link
              to="/productos/nuevo"
              className="btn-primary inline-flex items-center gap-2 mt-4"
            >
              <FiPlus size={20} />
              Agregar primer producto
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gaba-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Categoría</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Precio</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Stock</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProductos.map(producto => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{producto.sku}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{producto.nombre}</p>
                      {producto.descripcion && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">{producto.descripcion}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {producto.categoria ? producto.categoria.nombre : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-800">
                    {formatPrice(producto.precio)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      producto.stock > 10 ? 'bg-green-100 text-green-800' :
                      producto.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {producto.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(producto.id)}
                        className="p-2 text-gaba-primary hover:bg-gaba-light rounded-lg transition-colors"
                        title="Editar"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(producto.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productoId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default Productos;
