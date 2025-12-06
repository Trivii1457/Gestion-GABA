import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { pedidoService, clienteService, productoService } from '../services/api';
import Loading from '../components/Loading';

const PedidoForm = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    cliente_id: '',
    direccion_entrega: '',
    notas: ''
  });
  
  const [detalles, setDetalles] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientesData, productosData] = await Promise.all([
        clienteService.getAll(),
        productoService.getAll()
      ]);
      setClientes(clientesData);
      setProductos(productosData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    const cliente = clientes.find(c => c.id.toString() === clienteId);
    setFormData({
      ...formData,
      cliente_id: clienteId,
      direccion_entrega: cliente?.direccion || ''
    });
  };

  const handleAddProducto = () => {
    if (!selectedProducto || cantidad < 1) {
      setError('Selecciona un producto y cantidad válida');
      return;
    }

    const producto = productos.find(p => p.id.toString() === selectedProducto);
    if (!producto) return;

    // Check if product is already in the list
    const existingIndex = detalles.findIndex(d => d.producto_id === producto.id);
    if (existingIndex >= 0) {
      const newDetalles = [...detalles];
      newDetalles[existingIndex].cantidad += cantidad;
      setDetalles(newDetalles);
    } else {
      setDetalles([...detalles, {
        producto_id: producto.id,
        nombre: producto.nombre,
        sku: producto.sku,
        precio_unitario: parseFloat(producto.precio),
        cantidad: cantidad,
        stock: producto.stock
      }]);
    }

    setSelectedProducto('');
    setCantidad(1);
    setError(null);
  };

  const handleRemoveProducto = (index) => {
    const newDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(newDetalles);
  };

  const handleCantidadChange = (index, newCantidad) => {
    const newDetalles = [...detalles];
    newDetalles[index].cantidad = Math.max(1, parseInt(newCantidad) || 1);
    setDetalles(newDetalles);
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, d) => sum + (d.precio_unitario * d.cantidad), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cliente_id) {
      setError('Selecciona un cliente');
      return;
    }

    if (detalles.length === 0) {
      setError('Agrega al menos un producto');
      return;
    }

    // Validate stock
    for (const detalle of detalles) {
      if (detalle.cantidad > detalle.stock) {
        setError(`Stock insuficiente para ${detalle.nombre}. Disponible: ${detalle.stock}`);
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);

      await pedidoService.create({
        cliente_id: parseInt(formData.cliente_id),
        direccion_entrega: formData.direccion_entrega,
        notas: formData.notas,
        detalles: detalles.map(d => ({
          producto_id: d.producto_id,
          cantidad: d.cantidad
        }))
      });

      navigate('/pedidos');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el pedido');
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
          to="/pedidos"
          className="text-gaba-primary hover:text-gaba-secondary inline-flex items-center gap-2 mb-4"
        >
          <FiArrowLeft size={20} />
          Volver a Pedidos
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FiShoppingBag className="text-gaba-primary" />
          Nuevo Pedido
        </h1>
        <p className="text-gray-500 mt-1">Crea un nuevo pedido para un cliente</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Customer and details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Información del Cliente</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.cliente_id}
                    onChange={handleClienteChange}
                    className="input-field"
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} - {cliente.identificacion}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    value={formData.direccion_entrega}
                    onChange={(e) => setFormData({ ...formData, direccion_entrega: e.target.value })}
                    className="input-field"
                    placeholder="Dirección de entrega"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    className="input-field"
                    rows="2"
                    placeholder="Notas adicionales del pedido"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Agregar Productos</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <select
                  value={selectedProducto}
                  onChange={(e) => setSelectedProducto(e.target.value)}
                  className="input-field flex-1"
                >
                  <option value="">Seleccionar producto</option>
                  {productos.filter(p => p.stock > 0).map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} - {producto.sku} (Stock: {producto.stock}) - {formatPrice(producto.precio)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                  className="input-field w-24"
                  min="1"
                  placeholder="Cant."
                />
                <button
                  type="button"
                  onClick={handleAddProducto}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiPlus size={18} />
                  Agregar
                </button>
              </div>

              {detalles.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Producto</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Precio</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Cantidad</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Subtotal</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {detalles.map((detalle, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <p className="font-medium">{detalle.nombre}</p>
                            <p className="text-xs text-gray-500">{detalle.sku}</p>
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {formatPrice(detalle.precio_unitario)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              value={detalle.cantidad}
                              onChange={(e) => handleCantidadChange(index, e.target.value)}
                              className="w-16 text-center border rounded px-2 py-1"
                              min="1"
                              max={detalle.stock}
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatPrice(detalle.precio_unitario * detalle.cantidad)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveProducto(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Productos</span>
                  <span>{detalles.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Unidades totales</span>
                  <span>{detalles.reduce((sum, d) => sum + d.cantidad, 0)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gaba-primary">{formatPrice(calcularTotal())}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || detalles.length === 0}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FiSave size={20} />
                {saving ? 'Guardando...' : 'Crear Pedido'}
              </button>

              <Link
                to="/pedidos"
                className="block text-center mt-4 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PedidoForm;
