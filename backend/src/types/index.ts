// ============================================
// TIPOS PARA EVENTOS
// ============================================

export interface Evento {
  id_evento: number;
  nombre_evento: string;
  descripcion: string;
  imagen_url: string;
  clasificacion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  id_tipo_evento: number;
  id_empleado: number;
}

export interface TipoEvento {
  id_tipo_evento: number;
  nombre_tipo: string;
  descripcion: string;
  activo: boolean;
}

export interface Funcion {
  id_funcion: number;
  fecha: Date;
  hora: string;
  estado: string;
  boletos_vendidos: number;
  recaudacion: number;
  id_evento: number;
  id_auditorio: number;
}

// ============================================
// TIPOS PARA SEDES Y AUDITORIOS
// ============================================

export interface Sede {
  id_sede: number;
  nombre_sede: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  capacidad_total: number;
  activo: boolean;
}

export interface Auditorio {
  id_auditorio: number;
  nombre: string;
  capacidad: number;
  id_sede: number;
}

export interface Zona {
  id_zona: number;
  nombre_zona: string;
  capacidad: number;
  descripcion: string;
  precio_multiplicador: number;
  id_auditorio: number;
}

// ============================================
// TIPOS PARA BOLETOS
// ============================================

export interface TipoBoleto {
  id_tipo_boleto: number;
  nombre_tipo: string;
  descripcion: string;
  precio_base: number;
  activo: boolean;
  id_zona: number;
}

export interface Boleto {
  id_boleto: number;
  asiento: string;
  precio_final: number;
  vigente: boolean;
  id_tipo_boleto: number;
  id_estado_boleto: number;
  id_funcion: number;
  id_venta: number | null;
}

export interface EstadoBoleto {
  id_estado_boleto: number;
  nombre: string;
  descripcion: string;
}

// ============================================
// TIPOS PARA CLIENTES
// ============================================

export interface Cliente {
  id_cliente: number;
  nombre_completo: string;
  email: string;
  password_hash: string;
  telefono: string;
  numero_registro: string;
  fecha_registro: Date;
  id_municipio: number;
}

export interface ClienteRegistro {
  nombre_completo: string;
  email: string;
  password: string;
  telefono: string;
  id_municipio: number;
}

export interface ClienteLogin {
  email: string;
  password: string;
}

// ============================================
// TIPOS PARA VENTAS
// ============================================

export interface Venta {
  id_venta: number;
  fecha: Date;
  total: number;
  impuestos: number;
  id_cliente: number;
  id_empleado: number;
  id_metodo: number;
  id_promocion: number | null;
}

export interface MetodoPago {
  id_metodo: number;
  nombre_metodo: string;
  descripcion: string;
  comision: number;
  activo: boolean;
}

export interface Promocion {
  id_promocion: number;
  nombre_promocion: string;
  descripcion: string;
  descuento: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  activo: boolean;
  usos_maximos: number;
  usos_actuales: number;
}

// ============================================
// TIPOS PARA EMPLEADOS
// ============================================

export interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido: string;
  email: string;
  password_hash: string;
  telefono: string;
  salario: number;
  id_estado_empleado: number;
  id_tipo_empleado: number;
}

// ============================================
// TIPOS PARA UBICACIÓN
// ============================================

export interface Estado {
  id_estado: number;
  nombre: string;
}

export interface Municipio {
  id_municipio: number;
  nombre: string;
  id_estado: number;
}

// ============================================
// TIPOS PARA API RESPONSES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

