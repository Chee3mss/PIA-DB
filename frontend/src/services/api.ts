import axios, { type AxiosInstance, AxiosError } from 'axios';

// Configuración de la URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones - Agregar token si existe
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas - Manejo de errores
api.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// INTERFACES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface Evento {
  id_evento: number;
  nombre_evento: string;
  descripcion: string;
  imagen_url: string;
  clasificacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_tipo_evento: number;
  id_empleado: number;
  tipo_evento_nombre?: string;
}

export interface Funcion {
  id_funcion: number;
  fecha: string;
  hora: string;
  estado: string;
  boletos_vendidos: number;
  recaudacion: number;
  id_evento: number;
  id_auditorio: number;
  auditorio_nombre?: string;
  nombre_sede?: string;
}

export interface EventoDetalle {
  evento: Evento;
  funciones: Funcion[];
}

export interface TipoBoleto {
  id_tipo_boleto: number;
  nombre_tipo: string;
  descripcion: string;
  precio_base: number;
  activo: boolean;
  id_zona: number;
  nombre_zona?: string;
  zona_descripcion?: string;
  disponibles?: number;
}

export interface Cliente {
  id_cliente: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  numero_registro: string;
  fecha_registro: string;
}

export interface ClienteRegistro {
  nombre_completo: string;
  email: string;
  password: string;
  telefono?: string;
  id_municipio: number;
}

export interface ClienteLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  id_cliente: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  numero_registro: string;
  token: string;
}

export interface Estado {
  id_estado: number;
  nombre: string;
}

export interface Municipio {
  id_municipio: number;
  nombre: string;
  id_estado: number;
  estado_nombre?: string;
}

// ============================================
// SERVICIOS DE EVENTOS
// ============================================

export const eventosService = {
  // Obtener todos los eventos
  getEventos: async (): Promise<Evento[]> => {
    const response = await api.get<ApiResponse<Evento[]>>('/eventos');
    return response.data.data || [];
  },

  // Obtener un evento específico
  getEventoById: async (id: number): Promise<EventoDetalle> => {
    const response = await api.get<ApiResponse<EventoDetalle>>(`/eventos/${id}`);
    return response.data.data!;
  },

  // Obtener tipos de boletos para una función
  getTiposBoletos: async (idFuncion: number): Promise<TipoBoleto[]> => {
    const response = await api.get<ApiResponse<TipoBoleto[]>>(`/eventos/${idFuncion}/tipos-boletos`);
    return response.data.data || [];
  },

  // Obtener boletos disponibles para una función
  getBoletosDisponibles: async (idFuncion: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/eventos/${idFuncion}/boletos`);
    return response.data.data || [];
  },
};

// ============================================
// SERVICIOS DE CLIENTES
// ============================================

export const clientesService = {
  // Registrar un nuevo cliente
  registrar: async (datos: ClienteRegistro): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/clientes/registro', datos);
    
    // Guardar token y datos del usuario
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data.data!;
  },

  // Iniciar sesión
  login: async (credenciales: ClienteLogin): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/clientes/login', credenciales);
    
    // Guardar token y datos del usuario
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data.data!;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener perfil del cliente
  getPerfil: async (id: number): Promise<Cliente> => {
    const response = await api.get<ApiResponse<Cliente>>(`/clientes/${id}/perfil`);
    return response.data.data!;
  },

  // Obtener compras del cliente
  getCompras: async (id: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/clientes/${id}/compras`);
    return response.data.data || [];
  },

  // Obtener usuario actual del localStorage
  getCurrentUser: (): LoginResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

// ============================================
// SERVICIOS DE UBICACIÓN
// ============================================

export const ubicacionService = {
  // Obtener todos los estados
  getEstados: async (): Promise<Estado[]> => {
    const response = await api.get<ApiResponse<Estado[]>>('/ubicacion/estados');
    return response.data.data || [];
  },

  // Obtener todos los municipios
  getMunicipios: async (): Promise<Municipio[]> => {
    const response = await api.get<ApiResponse<Municipio[]>>('/ubicacion/municipios');
    return response.data.data || [];
  },

  // Obtener municipios por estado
  getMunicipiosByEstado: async (idEstado: number): Promise<Municipio[]> => {
    const response = await api.get<ApiResponse<Municipio[]>>(`/ubicacion/estados/${idEstado}/municipios`);
    return response.data.data || [];
  },
};

// ============================================
// UTILIDADES
// ============================================

export const apiUtils = {
  // Función para manejar errores
  handleError: (error: any): string => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      
      if (axiosError.response?.data?.error) {
        return axiosError.response.data.error;
      }
      
      if (axiosError.response?.status === 404) {
        return 'Recurso no encontrado';
      }
      
      if (axiosError.response?.status === 500) {
        return 'Error del servidor. Por favor, intenta más tarde';
      }
      
      if (axiosError.code === 'ECONNABORTED') {
        return 'Tiempo de espera agotado. Por favor, intenta de nuevo';
      }
      
      if (axiosError.message === 'Network Error') {
        return 'Error de red. Verifica tu conexión a Internet';
      }
    }
    
    return 'Ocurrió un error inesperado';
  },

  // Función para verificar el estado del servidor
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.data.success;
    } catch {
      return false;
    }
  },
};

export default api;

