import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '0'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para verificar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a la base de datos MySQL');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    return false;
  }
};

// Función para ejecutar queries con manejo de errores
export const query = async <T = any>(sql: string, params?: any[]): Promise<T> => {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  }
};

export default pool;

