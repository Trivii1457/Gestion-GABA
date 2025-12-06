import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const clienteService = {
  getAll: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  create: async (clienteData) => {
    const response = await api.post('/clientes', clienteData);
    return response.data;
  },

  update: async (id, clienteData) => {
    const response = await api.put(`/clientes/${id}`, clienteData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  }
};

export const categoriaService = {
  getAll: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  create: async (categoriaData) => {
    const response = await api.post('/categorias', categoriaData);
    return response.data;
  },

  update: async (id, categoriaData) => {
    const response = await api.put(`/categorias/${id}`, categoriaData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  }
};

export const productoService = {
  getAll: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  getByCategoria: async (categoriaId) => {
    const response = await api.get(`/productos/categoria/${categoriaId}`);
    return response.data;
  },

  create: async (productoData) => {
    const response = await api.post('/productos', productoData);
    return response.data;
  },

  update: async (id, productoData) => {
    const response = await api.put(`/productos/${id}`, productoData);
    return response.data;
  },

  updateStock: async (id, cantidad) => {
    const response = await api.patch(`/productos/${id}/stock`, { cantidad });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  }
};

export const pedidoService = {
  getAll: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  getByCliente: async (clienteId) => {
    const response = await api.get(`/pedidos/cliente/${clienteId}`);
    return response.data;
  },

  getByEstado: async (estado) => {
    const response = await api.get(`/pedidos/estado/${estado}`);
    return response.data;
  },

  getReporteFinanciero: async () => {
    const response = await api.get('/pedidos/reporte');
    return response.data;
  },

  create: async (pedidoData) => {
    const response = await api.post('/pedidos', pedidoData);
    return response.data;
  },

  update: async (id, pedidoData) => {
    const response = await api.put(`/pedidos/${id}`, pedidoData);
    return response.data;
  },

  updateEstado: async (id, estado) => {
    const response = await api.patch(`/pedidos/${id}/estado`, { estado });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/pedidos/${id}`);
    return response.data;
  }
};

export const abonoService = {
  getAll: async () => {
    const response = await api.get('/abonos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/abonos/${id}`);
    return response.data;
  },

  getByPedido: async (pedidoId) => {
    const response = await api.get(`/abonos/pedido/${pedidoId}`);
    return response.data;
  },

  create: async (abonoData) => {
    const response = await api.post('/abonos', abonoData);
    return response.data;
  },

  update: async (id, abonoData) => {
    const response = await api.put(`/abonos/${id}`, abonoData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/abonos/${id}`);
    return response.data;
  }
};

export default api;
