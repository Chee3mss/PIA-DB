import axios from 'axios';

interface SeatsioChart {
  key: string;
  name: string;
  status: string;
  tags?: string[];
  publishedVersionThumbnailUrl?: string;
}

interface SeatsioEvent {
  key: string;
  chartKey: string;
  name?: string;
  date?: string;
  supportsBestAvailable: boolean;
  forSaleConfig?: any;
  channels?: any[];
  socialDistancingRulesetKey?: string;
  tableBookingConfig?: any;
}

interface CreateEventParams {
  chartKey: string;
  eventName?: string;
  date?: string;
}

/**
 * Servicio para interactuar con la API de Seats.io
 * Documentación: https://docs.seats.io/docs/api-overview
 */
class SeatsioService {
  private api: any;
  private secretKey: string;
  private publicKey: string;
  private region: string;
  private baseUrl: string;

  constructor() {
    this.secretKey = process.env.SEATSIO_SECRET_KEY || '';
    this.publicKey = process.env.SEATSIO_PUBLIC_KEY || '';
    this.region = process.env.SEATSIO_REGION || 'na';
    
    // Determinar la URL base según la región
    // Nota: Seats.io ahora usa URLs con sufijo de región para todas las regiones
    if (this.region === 'eu') {
      this.baseUrl = 'https://api-eu.seatsio.net';
    } else if (this.region === 'na') {
      this.baseUrl = 'https://api-na.seatsio.net';
    } else {
      // Fallback a la URL legacy si no se especifica región
      this.baseUrl = 'https://api.seatsio.net';
    }

    // Crear instancia de axios con autenticación
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: this.secretKey,
        password: '' // Seats.io usa Basic Auth con la secret key como username
      }
    });

    if (!this.secretKey) {
      console.warn('⚠️  SEATSIO_SECRET_KEY no está configurada en las variables de entorno');
    }
  }

  /**
   * Verifica si el servicio está configurado correctamente
   */
  isConfigured(): boolean {
    return !!this.secretKey;
  }

  /**
   * Obtiene todos los charts (mapas de asientos) disponibles
   */
  async getCharts(): Promise<SeatsioChart[]> {
    try {
      const response = await this.api.get('/charts');
      return response.data.items || [];
    } catch (error: any) {
      console.error('Error al obtener charts de Seats.io:', error.response?.data || error.message);
      throw new Error('Error al obtener charts de Seats.io');
    }
  }

  /**
   * Obtiene un chart específico por su key
   */
  async getChart(chartKey: string): Promise<SeatsioChart> {
    try {
      const response = await this.api.get(`/charts/${chartKey}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener chart:', error.response?.data || error.message);
      throw new Error('Error al obtener chart de Seats.io');
    }
  }

  /**
   * Crea un nuevo evento en Seats.io
   * @param chartKey - Key del chart (mapa de asientos) a usar
   * @param eventName - Nombre del evento (opcional)
   * @param date - Fecha del evento (opcional)
   * @returns El evento creado con su key
   */
  async createEvent(params: CreateEventParams): Promise<SeatsioEvent> {
    try {
      const body: any = {
        chartKey: params.chartKey
      };

      if (params.eventName) {
        body.name = params.eventName;
      }

      if (params.date) {
        body.date = params.date;
      }

      const response = await this.api.post('/events', body);
      
      console.log(`✅ Evento creado en Seats.io: ${response.data.key}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear evento en Seats.io:', error.response?.data || error.message);
      throw new Error('Error al crear evento en Seats.io: ' + (error.response?.data?.message || error.message));
    }
  }

  /**
   * Obtiene un evento específico
   */
  async getEvent(eventKey: string): Promise<SeatsioEvent> {
    try {
      const response = await this.api.get(`/events/${eventKey}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener evento:', error.response?.data || error.message);
      throw new Error('Error al obtener evento de Seats.io');
    }
  }

  /**
   * Actualiza un evento existente
   */
  async updateEvent(eventKey: string, params: { name?: string; date?: string }): Promise<SeatsioEvent> {
    try {
      const response = await this.api.post(`/events/${eventKey}`, params);
      console.log(`✅ Evento actualizado en Seats.io: ${eventKey}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar evento:', error.response?.data || error.message);
      throw new Error('Error al actualizar evento en Seats.io');
    }
  }

  /**
   * Elimina un evento
   */
  async deleteEvent(eventKey: string): Promise<void> {
    try {
      await this.api.delete(`/events/${eventKey}`);
      console.log(`✅ Evento eliminado en Seats.io: ${eventKey}`);
    } catch (error: any) {
      console.error('Error al eliminar evento:', error.response?.data || error.message);
      throw new Error('Error al eliminar evento de Seats.io');
    }
  }

  /**
   * Obtiene el estado de los asientos de un evento
   */
  async getEventStatus(eventKey: string): Promise<any> {
    try {
      const response = await this.api.get(`/events/${eventKey}/status`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener estado del evento:', error.response?.data || error.message);
      throw new Error('Error al obtener estado del evento');
    }
  }

  /**
   * Reserva asientos en un evento
   */
  async bookSeats(eventKey: string, seatIds: string[]): Promise<any> {
    try {
      const response = await this.api.post(`/events/${eventKey}/actions/book`, {
        objects: seatIds
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al reservar asientos:', error.response?.data || error.message);
      throw new Error('Error al reservar asientos');
    }
  }

  /**
   * Libera asientos reservados
   */
  async releaseSeats(eventKey: string, seatIds: string[]): Promise<any> {
    try {
      const response = await this.api.post(`/events/${eventKey}/actions/release`, {
        objects: seatIds
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al liberar asientos:', error.response?.data || error.message);
      throw new Error('Error al liberar asientos');
    }
  }

  /**
   * Obtiene la clave pública (para uso en el frontend)
   */
  getPublicKey(): string {
    return this.publicKey;
  }

  /**
   * Obtiene la región configurada
   */
  getRegion(): string {
    return this.region;
  }
}

// Exportar una instancia única (singleton)
export default new SeatsioService();

