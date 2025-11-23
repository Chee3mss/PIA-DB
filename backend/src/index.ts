import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';

// Importar rutas
import eventosRoutes from './routes/eventos';
import clientesRoutes from './routes/clientes';
import ubicacionRoutes from './routes/ubicacion';
import authRoutes from './routes/auth';
import carouselRoutes from './routes/carousel';
import ventasRoutes from './routes/ventas';
import boletosRoutes from './routes/boletos';
import auditoriosRoutes from './routes/auditorios';
import seatsioRoutes from './routes/seatsio';
import funcionesRoutes from './routes/funciones';
import paymentsRoutes from './routes/payments';
import reportesRoutes from './routes/reportes';
import testRoutes from './routes/test';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app: Application = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARES
// ============================================

// CORS - Permitir peticiones desde el frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://floreriasuspiros.com'],
  credentials: true
}));

// Parser de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Desactivar caché para todas las respuestas
app.use((req: Request, res: Response, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Logger de peticiones
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// RUTAS
// ============================================

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de StageGo funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      eventos: '/api/eventos',
      clientes: '/api/clientes',
      ubicacion: '/api/ubicacion',
      carousel: '/api/carousel',
      ventas: '/api/ventas',
      boletos: '/api/boletos',
      auditorios: '/api/auditorios',
      seatsio: '/api/seatsio',
      funciones: '/api/funciones'
    }
  });
});

// Health check
app.get('/health', async (req: Request, res: Response) => {
  const dbConnected = await testConnection();
  res.json({
    success: true,
    status: 'running',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ubicacion', ubicacionRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/boletos', boletosRoutes);
app.use('/api/auditorios', auditoriosRoutes);
app.use('/api/seatsio', seatsioRoutes);
app.use('/api/funciones', funcionesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/test', testRoutes);

// Ruta 404 - No encontrado
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores global
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    console.log('🔌 Conectando a la base de datos...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error(' No se pudo conectar a la base de datos. Verifica las credenciales.');
      process.exit(1);
    }

    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log(` Base de datos: Conectada`);

    });
  } catch (error) {
    console.error(' Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('  SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n  SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

// Iniciar la aplicación
startServer();

export default app;

