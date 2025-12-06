import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUser } from 'react-icons/fi';
import { clienteService } from '../services/api';
import Loading from '../components/Loading';

const ClienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    identificacion: '',
    direccion: '',
    telefono: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchCliente();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const fetchCliente = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getById(id);
      setFormData({
        nombre: data.nombre || '',
        identificacion: data.identificacion || '',
        direccion: data.direccion || '',
        telefono: data.telefono || '',
        email: data.email || ''
      });
    } catch (err) {
      setError('Error al cargar el cliente');
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
    
    if (!formData.nombre.trim() || !formData.identificacion.trim()) {
      setError('El nombre y la identificación son obligatorios');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      if (isEditing) {
        await clienteService.update(id, formData);
      } else {
        await clienteService.create(formData);
      }
      
      navigate('/clientes');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el cliente');
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
          to="/clientes"
          className="text-gaba-primary hover:text-gaba-secondary inline-flex items-center gap-2 mb-4"
        >
          <FiArrowLeft size={20} />
          Volver a Clientes
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FiUser className="text-gaba-primary" />
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEditing ? 'Modifica la información del cliente' : 'Ingresa los datos del nuevo cliente'}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card max-w-2xl">
        <div className="space-y-6">
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
              placeholder="Nombre completo del cliente"
              required
            />
          </div>

          <div>
            <label htmlFor="identificacion" className="block text-sm font-medium text-gray-700 mb-1">
              Identificación <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="identificacion"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleChange}
              className="input-field"
              placeholder="Cédula o identificación"
              required
            />
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="input-field"
              placeholder="Dirección de entrega (se puede actualizar al crear pedido)"
            />
            <p className="text-xs text-gray-500 mt-1">
              La dirección se puede actualizar al momento de crear un pedido
            </p>
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="input-field"
              placeholder="Número de teléfono"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="correo@ejemplo.com"
            />
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
            to="/clientes"
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
