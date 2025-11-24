import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, ChevronLeft, Clock, MapPinIcon, Calendar } from 'lucide-react';
import { authService, clientesService } from '../services/api';
import Topbar from './TopBar';
import '../styles/Boletos.css';

interface Boleto {
  id_boleto: number;
  asiento: string;
  precio_final: number;
  vigente: number;
  tipo_boleto: string;
  estado_boleto: string;
  nombre_evento: string;
  descripcion_evento: string;
  imagen_url: string;
  fecha_funcion: string;
  hora_funcion: string;
  id_funcion: number;
  nombre_auditorio: string;
  nombre_lugar: string;
  direccion_lugar: string;
  ciudad: string;
  estado_lugar: string;
}

interface Compra {
  id_venta: number;
  fecha: string;
  total: number;
  monto_total: number;
  nombre_metodo: string;
  cantidad_boletos: number;
  boletos: Boleto[];
}

export default function Boletos() {
  const navigate = useNavigate();
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoletos = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        
        if (!currentUser) {
          navigate('/');
          return;
        }

        const idCliente = currentUser.id_cliente || currentUser.user?.id_cliente;
        
        if (!idCliente) {
          setError('No se pudo obtener tu información. Por favor, inicia sesión de nuevo.');
          setLoading(false);
          return;
        }

        // Cargar compras del cliente
        const comprasData: Compra[] = await clientesService.getCompras(idCliente);
        
        // Extraer todos los boletos de todas las compras
        const todosBoletos = comprasData.flatMap(compra => compra.boletos || []);
        setBoletos(todosBoletos);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar boletos:', err);
        setError('No se pudieron cargar tus boletos');
        setLoading(false);
      }
    };

    loadBoletos();
  }, [navigate]);

  const formatDate = (dateString: string, timeString: string) => {
    const fecha = new Date(dateString);
    const [horas, minutos] = timeString.split(':');
    fecha.setHours(parseInt(horas), parseInt(minutos));
    
    return fecha.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading) {
    return (
      <>
        <Topbar />
        <div className="boletos-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando tus boletos...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar />
        <div className="boletos-container">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="back-button">
              Volver al inicio
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="boletos-container">
        <div className="boletos-content">
          {/* Header */}
          <div className="boletos-header">
            <button onClick={() => navigate('/perfil')} className="back-btn">
              <ChevronLeft className="icon" />
              Volver a mi perfil
            </button>
            <h1>Mis Boletos</h1>
            <p className="subtitle">Aquí puedes ver todos tus boletos adquiridos</p>
          </div>

          {/* Lista de Boletos */}
          {boletos.length === 0 ? (
            <div className="empty-state">
              <Ticket className="empty-icon" />
              <p>Aún no tienes boletos</p>
              <button onClick={() => navigate('/')} className="cta-button">
                Explorar Eventos
              </button>
            </div>
          ) : (
            <div className="boletos-grid">
              {boletos.map((boleto) => (
                <div key={boleto.id_boleto} className="boleto-card">
                  <div className="boleto-card-header">
                    <h3>{boleto.nombre_evento}</h3>
                    <span className={`estado-badge ${boleto.vigente ? 'vigente' : 'no-vigente'}`}>
                      {boleto.vigente ? 'Vigente' : 'Usado/Expirado'}
                    </span>
                  </div>

                  <div className="boleto-card-body">
                    <div className="boleto-info-item">
                      <Calendar className="icon-small" />
                      <span>{formatDate(boleto.fecha_funcion, boleto.hora_funcion)}</span>
                    </div>

                    <div className="boleto-info-item">
                      <MapPinIcon className="icon-small" />
                      <span>{boleto.nombre_lugar} - {boleto.nombre_auditorio}</span>
                    </div>

                    <div className="boleto-info-item">
                      <MapPinIcon className="icon-small" />
                      <span>{boleto.ciudad}, {boleto.estado_lugar}</span>
                    </div>

                    <div className="boleto-details">
                      <div className="detail-row">
                        <span className="detail-label">Asiento:</span>
                        <span className="detail-value">{boleto.asiento}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Tipo:</span>
                        <span className="detail-value">{boleto.tipo_boleto}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Precio:</span>
                        <span className="detail-value price">{formatCurrency(boleto.precio_final)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="boleto-card-footer">
                    <Ticket className="icon" />
                    <span>Boleto #{boleto.id_boleto}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

