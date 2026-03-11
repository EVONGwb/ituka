import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050/api";

// Configuración de Axios
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ituka_token'); // Obtener token directamente de localStorage si no está disponible en auth.js
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Productos ---

export const getProducts = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Admin
export const createProduct = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// --- Funciones Legacy (fetch) ---
// Manteniendo compatibilidad si es necesario, pero prefiriendo axios arriba
export async function apiFetch(path, { token, method = "GET", body } = {}) {
  try {
    const config = {
      method,
      url: path,
      headers: {}
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (body) {
      config.data = body;
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    // Si el error es de axios (response), extraemos el mensaje
    if (error.response) {
      // Intentamos obtener el mensaje de error del backend
      const message = error.response.data?.message || error.response.data?.error || 'Error en la petición';
      throw new Error(message);
    }
    // Si no, relanzamos el error original
    throw error;
  }
}
