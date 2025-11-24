import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  Ticket, 
  Users, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Building2,
  Settings,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { authService, adminService, clientesService, ventasService, auditoriosService, funcionesService, tipoBoletosService, reportesService, type Auditorio, type Sede, type FuncionDetalle, type CrearFuncionData, type TipoBoletoDeta } from '../services/api';
import '../styles/AdminPanel.css';

type Section = 'dashboard' | 'eventos' | 'compras' | 'clientes' | 'auditorios' | 'seatsio' | 'precios' | 'reportes';

interface Evento {
  id_evento: number;
  nombre_evento: string;
  descripcion: string;
  imagen_url: string;
  clasificacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo_evento_nombre?: string;
  id_tipo_evento?: number;
}

interface Compra {
  id_venta: number;
  fecha: string;
  total: number;
  nombre_cliente: string;
  email_cliente: string;
  cantidad_boletos: number;
}

interface Cliente {
  id_cliente: number;
  nombre_completo: string;
  email: string;
  telefono?: string;
  fecha_registro: string;
  municipio?: string;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para datos
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [auditorios, setAuditorios] = useState<Auditorio[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [tipoBoletos, setTipoBoletos] = useState<TipoBoletoDeta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para modales de edición
  const [editingAuditorio, setEditingAuditorio] = useState<Auditorio | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Estados para Seats.io
  const [seatsioCharts, setSeatsioCharts] = useState<any[]>([]);
  const [seatsioConfig, setSeatsioConfig] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  
  // Estados para edición de eventos
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
  const [eventFunctions, setEventFunctions] = useState<FuncionDetalle[]>([]);
  const [tiposEvento, setTiposEvento] = useState<any[]>([]);
  
  // Estados para creación de eventos
  const [isCreateEventoModalOpen, setIsCreateEventoModalOpen] = useState(false);
  
  // Estados para precios
  const [editingPrecio, setEditingPrecio] = useState<TipoBoletoDeta | null>(null);
  const [isPrecioModalOpen, setIsPrecioModalOpen] = useState(false);
  
  // Estado para modo de entrada de Seats.io en modal de auditorio
  const [seatsioInputMode, setSeatsioInputMode] = useState<'select' | 'manual'>('select');

  // Estados para reportes
  const [reportesData, setReportesData] = useState<any>(null);
  const [loadingReportes, setLoadingReportes] = useState(false);
  const [fechaInicioReporte, setFechaInicioReporte] = useState('');
  const [fechaFinReporte, setFechaFinReporte] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    
    // Verificar si el usuario es empleado
    if (!user || user.tipo !== 'empleado') {
      navigate('/');
      return;
    }

    setCurrentUser(user);
    loadInitialData();

    // Manejar hash de URL
    const hash = window.location.hash.replace('#', '');
    if (hash && ['dashboard', 'eventos', 'compras', 'clientes', 'auditorios', 'seatsio'].includes(hash)) {
      setCurrentSection(hash as Section);
    }
  }, [navigate]);

  // Efecto para cargar datos según la sección
  useEffect(() => {
    switch (currentSection) {
      case 'compras':
        if (compras.length === 0) loadCompras();
        break;
      case 'clientes':
        if (clientes.length === 0) loadClientes();
        break;
      case 'auditorios':
        if (auditorios.length === 0) loadAuditorios();
        if (seatsioCharts.length === 0) loadSeatsioData();
        break;
      case 'seatsio':
        loadSeatsioData();
        break;
      case 'precios':
        if (tipoBoletos.length === 0) loadTipoBoletos();
        break;
      case 'reportes':
        loadReportes();
        break;
    }
  }, [currentSection]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Cargar eventos, compras y clientes para el dashboard
      const [eventosData, comprasData, clientesData] = await Promise.all([
        adminService.getAllEventos(),
        ventasService.getAllVentas(),
        clientesService.getAllClientes()
      ]);
      console.log('Datos de compras recibidos:', comprasData);
      console.log('Total de compras:', comprasData.length);
      if (comprasData.length > 0) {
        console.log('Ejemplo de compra:', comprasData[0]);
        console.log('cantidad_boletos del ejemplo:', comprasData[0].cantidad_boletos);
        console.log('Todas las cantidades:', comprasData.map(c => c.cantidad_boletos));
      }
      setEventos(eventosData);
      setCompras(comprasData);
      setClientes(clientesData);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const loadCompras = async () => {
    try {
      const comprasData = await ventasService.getAllVentas();
      setCompras(comprasData);
    } catch (error) {
      console.error('Error cargando compras:', error);
    }
  };

  const loadClientes = async () => {
    try {
      const clientesData = await clientesService.getAllClientes();
      setClientes(clientesData);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const loadAuditorios = async () => {
    try {
      const auditoriosData = await auditoriosService.getAllAuditorios();
      setAuditorios(auditoriosData);
      
      // Cargar sedes si no están cargadas
      if (sedes.length === 0) {
        const sedesData = await auditoriosService.getSedes();
        setSedes(sedesData);
      }
    } catch (error) {
      console.error('Error cargando auditorios:', error);
    }
  };

  const loadTipoBoletos = async () => {
    try {
      const tipoBoletosDeta = await tipoBoletosService.getAllTipoBoletos();
      setTipoBoletos(tipoBoletosDeta);
    } catch (error) {
      console.error('Error cargando tipos de boleto:', error);
    }
  };

  const loadReportes = async () => {
    try {
      setLoadingReportes(true);
      
      // Primero sincronizar estadísticas de funciones
      try {
        await reportesService.syncFuncionesStats();
      } catch (syncError) {
        console.warn('No se pudo sincronizar estadísticas:', syncError);
      }
      
      // Cargar todos los reportes en paralelo
      const [
        ventasDelDia,
        funcionesMasVendidas,
        clientesTop,
        horariosVentas,
        eventosMasVendidos,
        estadisticasGenerales
      ] = await Promise.all([
        reportesService.getVentasDelDia(),
        reportesService.getFuncionesMasVendidas(fechaInicioReporte || undefined, fechaFinReporte || undefined),
        reportesService.getClientesTop(10),
        reportesService.getHorariosVentas(),
        reportesService.getEventosMasVendidos(fechaInicioReporte || undefined, fechaFinReporte || undefined),
        reportesService.getEstadisticasGenerales()
      ]);

      setReportesData({
        ventasDelDia,
        funcionesMasVendidas,
        clientesTop,
        horariosVentas,
        eventosMasVendidos,
        estadisticasGenerales
      });
      
      setLoadingReportes(false);
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setLoadingReportes(false);
    }
  };

  const loadSeatsioData = async () => {
    try {
      // Cargar charts disponibles
      const chartsResponse = await fetch('http://localhost:3001/api/seatsio/charts');
      if (chartsResponse.ok) {
        const chartsData = await chartsResponse.json();
        setSeatsioCharts(chartsData.charts || []);
      }

      // Cargar configuración
      const configResponse = await fetch('http://localhost:3001/api/seatsio/config');
      if (configResponse.ok) {
        const configData = await configResponse.json();
        setSeatsioConfig(configData);
      }
    } catch (error) {
      console.error('Error cargando datos de Seats.io:', error);
    }
  };

  const handleSyncAllFunctions = async () => {
    if (!confirm('¿Deseas sincronizar todas las funciones con Seats.io? Esto creará eventos automáticamente para las funciones que no los tengan.')) {
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch('http://localhost:3001/api/seatsio/sync-all', {
        method: 'POST'
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Sincronización completada!\n\nTotal: ${result.total}\nÉxito: ${result.success}\nFallidos: ${result.failed}`);
      } else {
        alert(`❌ Error en sincronización: ${result.error}`);
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveDefaultChart = async (chartKey: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/seatsio/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config_key: 'default_chart_key',
          config_value: chartKey
        })
      });

      if (response.ok) {
        alert('✅ Chart por defecto guardado correctamente');
        loadSeatsioData();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.error}`);
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleDeleteEvento = async (id: number) => {
    try {
      await adminService.eliminarEvento(id);
      alert('✅ Evento eliminado correctamente');
      // Recargar eventos
      const eventosData = await adminService.getAllEventos();
      setEventos(eventosData);
    } catch (error: any) {
      alert(`❌ Error al eliminar evento: ${error.message}`);
    }
  };

  const handleOpenCreateEvento = async () => {
    try {
      // Cargar tipos de evento si no están cargados
      if (tiposEvento.length === 0) {
        const tipos = await fetch('http://localhost:3001/api/eventos/categorias');
        const tiposData = await tipos.json();
        setTiposEvento(tiposData);
      }
      
      setIsCreateEventoModalOpen(true);
    } catch (error) {
      console.error('Error cargando tipos de evento:', error);
      alert('Error al abrir el formulario de creación');
    }
  };

  const handleCreateEvento = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.currentTarget);
      const eventoData = {
        nombre_evento: formData.get('nombre_evento'),
        descripcion: formData.get('descripcion'),
        imagen_url: formData.get('imagen_url'),
        clasificacion: formData.get('clasificacion'),
        fecha_inicio: formData.get('fecha_inicio'),
        fecha_fin: formData.get('fecha_fin'),
        id_tipo_evento: parseInt(formData.get('id_tipo_evento') as string)
      };

      await adminService.crearEvento(eventoData);
      alert('✅ Evento creado correctamente');
      
      // Recargar eventos
      const eventosData = await adminService.getAllEventos();
      setEventos(eventosData);
      
      setIsCreateEventoModalOpen(false);
    } catch (error: any) {
      alert(`❌ Error al crear evento: ${error.message}`);
    }
  };

  const handleEditPrecio = (tipoBoleto: TipoBoletoDeta) => {
    setEditingPrecio(tipoBoleto);
    setIsPrecioModalOpen(true);
  };

  const handleSavePrecio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPrecio) return;

    try {
      const formData = new FormData(e.currentTarget);
      const nuevoPrecio = parseFloat(formData.get('precio_base') as string);

      if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
        alert('❌ Por favor ingresa un precio válido');
        return;
      }

      await tipoBoletosService.updatePrecio(editingPrecio.id_tipo_boleto, nuevoPrecio);
      alert('✅ Precio actualizado correctamente');
      
      // Recargar tipos de boleto
      await loadTipoBoletos();
      
      setIsPrecioModalOpen(false);
      setEditingPrecio(null);
    } catch (error: any) {
      alert(`❌ Error al actualizar precio: ${error.message}`);
    }
  };

  const handleEditEvento = async (evento: Evento) => {
    try {
      setEditingEvento(evento);
      
      // Cargar funciones del evento usando el servicio
      const funciones = await funcionesService.obtenerFuncionesPorEvento(evento.id_evento);
      setEventFunctions(funciones);
      
      // Cargar tipos de evento si no están cargados
      if (tiposEvento.length === 0) {
        const tipos = await fetch('http://localhost:3001/api/eventos/categorias');
        const tiposData = await tipos.json();
        setTiposEvento(tiposData);
      }
      
      // Cargar auditorios si no están cargados
      if (auditorios.length === 0) {
        await loadAuditorios();
      }
      
      setIsEventoModalOpen(true);
    } catch (error) {
      console.error('Error cargando evento:', error);
      alert('Error al cargar el evento');
    }
  };

  const handleSaveEvento = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvento) return;

    try {
      const formData = new FormData(e.currentTarget);
      const eventoData = {
        nombre_evento: formData.get('nombre_evento'),
        descripcion: formData.get('descripcion'),
        imagen_url: formData.get('imagen_url'),
        clasificacion: formData.get('clasificacion'),
        fecha_inicio: formData.get('fecha_inicio'),
        fecha_fin: formData.get('fecha_fin'),
        id_tipo_evento: parseInt(formData.get('id_tipo_evento') as string)
      };

      await adminService.actualizarEvento(editingEvento.id_evento, eventoData);
      alert('✅ Evento actualizado correctamente');
      
      // Recargar eventos
      const eventosData = await adminService.getAllEventos();
      setEventos(eventosData);
      
      setIsEventoModalOpen(false);
      setEditingEvento(null);
    } catch (error: any) {
      alert(`❌ Error al actualizar evento: ${error.message}`);
    }
  };

  const handleCreateFunction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvento) return;

    try {
      const formData = new FormData(e.currentTarget);
      const fecha = formData.get('fecha') as string;
      const hora = formData.get('hora') as string;
      const id_auditorio = parseInt(formData.get('id_auditorio') as string);

      // Combinar fecha y hora en formato ISO
      const fecha_hora = `${fecha} ${hora}:00`;

      const funcionData: CrearFuncionData = {
        id_evento: editingEvento.id_evento,
        id_auditorio,
        fecha_hora
      };

      const response = await funcionesService.crearFuncion(funcionData);

      if (response.success) {
        alert('✅ Función creada correctamente');
        // Recargar funciones
        const funciones = await funcionesService.obtenerFuncionesPorEvento(editingEvento.id_evento);
        setEventFunctions(funciones);
        
        // Limpiar formulario
        (e.target as HTMLFormElement).reset();
      } else {
        alert(`❌ Error: ${response.message || 'Error al crear función'}`);
      }
    } catch (error: any) {
      console.error('Error al crear función:', error);
      alert(`❌ Error al crear función: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteFunction = async (idFuncion: number) => {
    if (!editingEvento) return;
    
    if (!confirm('¿Estás seguro de eliminar esta función?')) return;

    try {
      const response = await funcionesService.eliminarFuncion(idFuncion);

      if (response.success) {
        alert('✅ Función eliminada correctamente');
        // Recargar funciones
        const funciones = await funcionesService.obtenerFuncionesPorEvento(editingEvento.id_evento);
        setEventFunctions(funciones);
      } else {
        alert(`❌ Error: ${response.message || 'Error al eliminar función'}`);
      }
    } catch (error: any) {
      console.error('Error al eliminar función:', error);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
    setSearchTerm('');
    window.location.hash = section;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
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
        <div className="admin-panel">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando panel de administración...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-panel">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h2>Panel Admin</h2>
            <p>{currentUser?.nombre_completo || currentUser?.email}</p>
            <span className="user-role">{currentUser?.rol || 'Administrador'}</span>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${currentSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleSectionChange('dashboard')}
            >
              <LayoutDashboard className="icon" />
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-item ${currentSection === 'eventos' ? 'active' : ''}`}
              onClick={() => handleSectionChange('eventos')}
            >
              <Calendar className="icon" />
              <span>Eventos</span>
            </button>

            <button
              className={`nav-item ${currentSection === 'compras' ? 'active' : ''}`}
              onClick={() => handleSectionChange('compras')}
            >
              <ShoppingCart className="icon" />
              <span>Compras</span>
            </button>

            <button
              className={`nav-item ${currentSection === 'clientes' ? 'active' : ''}`}
              onClick={() => handleSectionChange('clientes')}
            >
              <Users className="icon" />
              <span>Clientes</span>
            </button>

            <button
              className={`nav-item ${currentSection === 'auditorios' ? 'active' : ''}`}
              onClick={() => handleSectionChange('auditorios')}
            >
              <Building2 className="icon" />
              <span>Auditorios</span>
            </button>

            <button
              className={`nav-item ${currentSection === 'seatsio' ? 'active' : ''}`}
              onClick={() => handleSectionChange('seatsio')}
            >
              <Settings className="icon" />
              <span>Seats.io Config</span>
            </button>

            <button
              className={`nav-item ${currentSection === 'precios' ? 'active' : ''}`}
              onClick={() => handleSectionChange('precios')}
            >
              <CreditCard className="icon" />
              <span>Precios</span>
            </button>

            <button
              className={`nav-item ${currentSection === 'reportes' ? 'active' : ''}`}
              onClick={() => handleSectionChange('reportes')}
            >
              <BarChart3 className="icon" />
              <span>Reportes</span>
            </button>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut className="icon" />
            <span>Cerrar Sesión</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Dashboard */}
          {currentSection === 'dashboard' && (
            <div className="dashboard-section">
              <h1 className="section-title">Dashboard</h1>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon eventos">
                    <Calendar />
                  </div>
                  <div className="stat-info">
                    <h3>{eventos.length}</h3>
                    <p>Eventos Totales</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon compras">
                    <ShoppingCart />
                  </div>
                  <div className="stat-info">
                    <h3>{compras.length}</h3>
                    <p>Compras</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon clientes">
                    <Users />
                  </div>
                  <div className="stat-info">
                    <h3>{clientes.length}</h3>
                    <p>Clientes</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon boletos">
                    <Ticket />
                  </div>
                  <div className="stat-info">
                    <h3>{compras.reduce((total, compra) => total + (Number(compra.cantidad_boletos) || 0), 0)}</h3>
                    <p>Boletos Vendidos</p>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h2>Eventos Recientes</h2>
                <div className="activity-list">
                  {eventos.slice(0, 5).map(evento => (
                    <div key={evento.id_evento} className="activity-item">
                      <img src={evento.imagen_url} alt={evento.nombre_evento} />
                      <div className="activity-info">
                        <h4>{evento.nombre_evento}</h4>
                        <p>{formatDate(evento.fecha_inicio)}</p>
                      </div>
                      <span className="activity-badge">{evento.tipo_evento_nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Eventos */}
          {currentSection === 'eventos' && (
            <div className="eventos-section">
              <div className="section-header">
                <h1 className="section-title">Gestión de Eventos</h1>
                <button className="btn-primary" onClick={handleOpenCreateEvento}>
                  <Plus className="icon" />
                  Nuevo Evento
                </button>
              </div>

              <div className="admin-search-bar">
                <Search className="icon" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="eventos-grid">
                {eventos
                  .filter(evento => 
                    evento.nombre_evento.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(evento => (
                    <div key={evento.id_evento} className="evento-card">
                      <img src={evento.imagen_url} alt={evento.nombre_evento} />
                      <div className="evento-content">
                        <h3>{evento.nombre_evento}</h3>
                        <p className="evento-date">{formatDate(evento.fecha_inicio)}</p>
                        <p className="evento-type">{evento.tipo_evento_nombre}</p>
                        <div className="evento-actions">
                          <button 
                            className="btn-action view"
                            onClick={() => navigate(`/event/${evento.id_evento}`)}
                            title="Ver evento"
                          >
                            <Eye className="icon" />
                          </button>
                          <button 
                            className="btn-action edit"
                            onClick={() => handleEditEvento(evento)}
                            title="Editar evento"
                          >
                            <Edit className="icon" />
                          </button>
                          <button 
                            className="btn-action delete"
                            onClick={() => {
                              if (confirm(`¿Estás seguro de eliminar el evento "${evento.nombre_evento}"?`)) {
                                handleDeleteEvento(evento.id_evento);
                              }
                            }}
                            title="Eliminar evento"
                          >
                            <Trash2 className="icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Compras */}
          {currentSection === 'compras' && (
            <div className="compras-section">
              <h1 className="section-title">Compras de Clientes</h1>
              
              <div className="admin-search-bar">
                <Search className="icon" />
                <input
                  type="text"
                  placeholder="Buscar compras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID Venta</th>
                      <th>Cliente</th>
                      <th>Email</th>
                      <th>Fecha</th>
                      <th>Boletos</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compras.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-message">
                          No hay compras registradas
                        </td>
                      </tr>
                    ) : (
                      compras.map(compra => (
                        <tr key={compra.id_venta}>
                          <td>#{compra.id_venta}</td>
                          <td>{compra.nombre_cliente}</td>
                          <td>{compra.email_cliente}</td>
                          <td>{formatDate(compra.fecha)}</td>
                          <td>{compra.cantidad_boletos}</td>
                          <td>{formatCurrency(compra.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clientes */}
          {currentSection === 'clientes' && (
            <div className="clientes-section">
              <h1 className="section-title">Clientes Registrados</h1>
              
              <div className="admin-search-bar">
                <Search className="icon" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Registro</th>
                      <th>Ubicación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-message">
                          No hay clientes registrados
                        </td>
                      </tr>
                    ) : (
                      clientes.map(cliente => (
                        <tr key={cliente.id_cliente}>
                          <td>#{cliente.id_cliente}</td>
                          <td>{cliente.nombre_completo}</td>
                          <td>{cliente.email}</td>
                          <td>{cliente.telefono || 'N/A'}</td>
                          <td>{formatDate(cliente.fecha_registro)}</td>
                          <td>{cliente.municipio || 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Auditorios */}
          {currentSection === 'auditorios' && (
            <div className="auditorios-section">
              <div className="section-header">
                <h1 className="section-title">Gestión de Auditorios</h1>
                <p className="section-subtitle">Configura los auditorios y vincula con Seats.io</p>
              </div>
              
              <div className="admin-search-bar">
                <Search className="icon" />
                <input
                  type="text"
                  placeholder="Buscar auditorios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Sede</th>
                      <th>Ciudad</th>
                      <th>Capacidad</th>
                      <th>Seats.io</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditorios.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="empty-message">
                          No hay auditorios registrados
                        </td>
                      </tr>
                    ) : (
                      auditorios
                        .filter(aud => 
                          searchTerm === '' || 
                          aud.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          aud.nombre_sede?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(auditorio => (
                        <tr key={auditorio.id_auditorio}>
                          <td>#{auditorio.id_auditorio}</td>
                          <td><strong>{auditorio.nombre}</strong></td>
                          <td>{auditorio.nombre_sede || 'N/A'}</td>
                          <td>{auditorio.ciudad || 'N/A'}</td>
                          <td>{auditorio.capacidad} personas</td>
                          <td>
                            {auditorio.seatsio_event_key ? (
                              <span className="badge seatsio-configured">
                                ✓ Configurado
                              </span>
                            ) : (
                              <span className="badge seatsio-not-configured">
                                ✗ Sin configurar
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${auditorio.activo ? 'active' : 'inactive'}`}>
                              {auditorio.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-action edit"
                              onClick={() => {
                                setEditingAuditorio(auditorio);
                                // Determinar modo inicial: si tiene key y no está en charts, es manual (probablemente event key legacy)
                                // Si no tiene key o está en charts, sugerir select
                                const isChart = !auditorio.seatsio_event_key || seatsioCharts.some(c => c.key === auditorio.seatsio_event_key);
                                setSeatsioInputMode(isChart ? 'select' : 'manual');
                                setIsEditModalOpen(true);
                              }}
                              title="Editar configuración de Seats.io"
                            >
                              <Edit className="icon" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Precios */}
          {currentSection === 'precios' && (
            <div className="precios-section">
              <div className="section-header">
                <h1 className="section-title">Gestión de Precios</h1>
                <p className="section-subtitle">Administra los precios de cada tipo de boleto por auditorio</p>
              </div>
              
              <div className="admin-search-bar">
                <Search className="icon" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, auditorio o sede..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Zona</th>
                      <th>Auditorio</th>
                      <th>Sede</th>
                      <th>Precio Base</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tipoBoletos.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="empty-message">
                          No hay tipos de boleto registrados
                        </td>
                      </tr>
                    ) : (
                      tipoBoletos
                        .filter(tb => 
                          searchTerm === '' || 
                          tb.nombre_tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tb.nombre_zona?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tb.auditorio_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tb.nombre_sede?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(tipoBoleto => (
                        <tr key={tipoBoleto.id_tipo_boleto}>
                          <td>#{tipoBoleto.id_tipo_boleto}</td>
                          <td><strong>{tipoBoleto.nombre_tipo}</strong></td>
                          <td>{tipoBoleto.nombre_zona || 'N/A'}</td>
                          <td>{tipoBoleto.auditorio_nombre || 'N/A'}</td>
                          <td>{tipoBoleto.nombre_sede || 'N/A'}</td>
                          <td className="precio-cell">
                            <strong>${tipoBoleto.precio_base.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
                          </td>
                          <td>
                            <span className={`badge ${tipoBoleto.activo ? 'active' : 'inactive'}`}>
                              {tipoBoleto.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-action edit"
                              onClick={() => handleEditPrecio(tipoBoleto)}
                              title="Editar precio"
                            >
                              <Edit className="icon" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reportes */}
          {currentSection === 'reportes' && (
            <div className="reportes-section">
              <div className="section-header">
                <h1 className="section-title">📊 Reportes y Estadísticas</h1>
                <p className="section-subtitle">Análisis detallado de ventas y rendimiento</p>
              </div>

              {/* Filtros de fecha */}
              <div className="reportes-filters">
                <div className="filter-group">
                  <label htmlFor="fecha_inicio_reporte">Fecha Inicio:</label>
                  <input
                    type="date"
                    id="fecha_inicio_reporte"
                    value={fechaInicioReporte}
                    onChange={(e) => setFechaInicioReporte(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="fecha_fin_reporte">Fecha Fin:</label>
                  <input
                    type="date"
                    id="fecha_fin_reporte"
                    value={fechaFinReporte}
                    onChange={(e) => setFechaFinReporte(e.target.value)}
                  />
                </div>
                <button className="btn-primary" onClick={loadReportes} disabled={loadingReportes}>
                  {loadingReportes ? '⏳ Cargando...' : '🔄 Actualizar Reportes'}
                </button>
              </div>

              {loadingReportes ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Cargando reportes...</p>
                </div>
              ) : reportesData ? (
                <>
                  {/* Estadísticas Generales */}
                  <div className="reportes-grid">
                    <div className="reporte-card">
                      <h3>💰 Total Recaudado</h3>
                      <p className="reporte-value">
                        {formatCurrency(reportesData.estadisticasGenerales.ventas.total_recaudado || 0)}
                      </p>
                      <p className="reporte-label">{reportesData.estadisticasGenerales.ventas.total_ventas} ventas totales</p>
                    </div>

                    <div className="reporte-card">
                      <h3>🎫 Boletos Vendidos</h3>
                      <p className="reporte-value">{reportesData.estadisticasGenerales.boletos.total_boletos || 0}</p>
                      <p className="reporte-label">Total de boletos</p>
                    </div>

                    <div className="reporte-card">
                      <h3>👥 Clientes</h3>
                      <p className="reporte-value">{reportesData.estadisticasGenerales.clientes.total_clientes || 0}</p>
                      <p className="reporte-label">Clientes registrados</p>
                    </div>

                    <div className="reporte-card">
                      <h3>📅 Eventos Activos</h3>
                      <p className="reporte-value">{reportesData.estadisticasGenerales.eventos.total_eventos || 0}</p>
                      <p className="reporte-label">Eventos próximos</p>
                    </div>
                  </div>

                  {/* Ventas del Día */}
                  <div className="reporte-section">
                    <h2>💵 Ventas del Día Actual</h2>
                    {reportesData.ventasDelDia.ventas.length > 0 ? (
                      <>
                        <div className="resumen-stats">
                          <div className="stat-item">
                            <span className="stat-label">Total Ventas:</span>
                            <span className="stat-value">{reportesData.ventasDelDia.resumen.total_ventas}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Recaudado:</span>
                            <span className="stat-value">{formatCurrency(reportesData.ventasDelDia.resumen.total_recaudado)}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Boletos:</span>
                            <span className="stat-value">{reportesData.ventasDelDia.resumen.total_boletos}</span>
                          </div>
                        </div>
                        <div className="table-container">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>ID Venta</th>
                                <th>Cliente</th>
                                <th>Evento</th>
                                <th>Boletos</th>
                                <th>Total</th>
                                <th>Fecha</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportesData.ventasDelDia.ventas.map((venta: any) => (
                                <tr key={venta.id_venta}>
                                  <td>#{venta.id_venta}</td>
                                  <td>{venta.cliente}</td>
                                  <td>{venta.evento || 'N/A'}</td>
                                  <td>{venta.cantidad_boletos}</td>
                                  <td>{formatCurrency(venta.total)}</td>
                                  <td>{formatDate(venta.fecha)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <p className="empty-message">No hay ventas registradas hoy</p>
                    )}
                  </div>

                  {/* Funciones Más Vendidas */}
                  <div className="reporte-section">
                    <h2>🎭 Funciones Más Vendidas</h2>
                    {reportesData.funcionesMasVendidas.length > 0 ? (
                      <div className="table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Evento</th>
                              <th>Fecha</th>
                              <th>Hora</th>
                              <th>Auditorio</th>
                              <th>Sede</th>
                              <th>Boletos Vendidos</th>
                              <th>Ocupación</th>
                              <th>Recaudación</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportesData.funcionesMasVendidas.map((funcion: any) => (
                              <tr key={funcion.id_funcion}>
                                <td><strong>{funcion.nombre_evento}</strong></td>
                                <td>{new Date(funcion.fecha).toLocaleDateString('es-MX')}</td>
                                <td>{funcion.hora}</td>
                                <td>{funcion.auditorio}</td>
                                <td>{funcion.nombre_sede}</td>
                                <td>{funcion.boletos_vendidos} / {funcion.capacidad}</td>
                                <td>
                                  <span className={`badge ${funcion.porcentaje_ocupacion > 80 ? 'active' : funcion.porcentaje_ocupacion > 50 ? 'seatsio-configured' : 'inactive'}`}>
                                    {funcion.porcentaje_ocupacion}%
                                  </span>
                                </td>
                                <td>{formatCurrency(funcion.recaudacion)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="empty-message">No hay datos de funciones en el periodo seleccionado</p>
                    )}
                  </div>

                  {/* Clientes Top */}
                  <div className="reporte-section">
                    <h2>🏆 Clientes que Más Compran</h2>
                    {reportesData.clientesTop.length > 0 ? (
                      <div className="table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Posición</th>
                              <th>Cliente</th>
                              <th>Email</th>
                              <th>Total Compras</th>
                              <th>Boletos Comprados</th>
                              <th>Total Gastado</th>
                              <th>Última Compra</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportesData.clientesTop.map((cliente: any, index: number) => (
                              <tr key={cliente.id_cliente}>
                                <td>
                                  <span className={`badge ${index === 0 ? 'active' : index < 3 ? 'seatsio-configured' : ''}`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                  </span>
                                </td>
                                <td><strong>{cliente.nombre_completo}</strong></td>
                                <td>{cliente.email}</td>
                                <td>{cliente.total_compras}</td>
                                <td>{cliente.total_boletos}</td>
                                <td>{formatCurrency(cliente.total_gastado)}</td>
                                <td>{new Date(cliente.ultima_compra).toLocaleDateString('es-MX')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="empty-message">No hay datos de clientes</p>
                    )}
                  </div>

                  {/* Horarios con Más Ventas */}
                  <div className="reporte-section">
                    <h2>⏰ Horarios con Más Ventas</h2>
                    {reportesData.horariosVentas.length > 0 ? (
                      <div className="table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Horario</th>
                              <th>Funciones</th>
                              <th>Boletos Vendidos</th>
                              <th>Promedio por Función</th>
                              <th>Recaudación</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportesData.horariosVentas.map((horario: any) => (
                              <tr key={horario.hora}>
                                <td><strong>{horario.hora}:00 hrs</strong></td>
                                <td>{horario.total_funciones}</td>
                                <td>{horario.total_boletos_vendidos}</td>
                                <td>{horario.promedio_boletos_por_funcion}</td>
                                <td>{formatCurrency(horario.total_recaudacion)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="empty-message">No hay datos de horarios</p>
                    )}
                  </div>

                  {/* Eventos Más Vendidos */}
                  <div className="reporte-section">
                    <h2>🎉 Eventos Más Vendidos</h2>
                    {reportesData.eventosMasVendidos.length > 0 ? (
                      <div className="eventos-vendidos-grid">
                        {reportesData.eventosMasVendidos.map((evento: any, index: number) => (
                          <div key={evento.id_evento} className="evento-vendido-card">
                            <div className="ranking-badge">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </div>
                            <img src={evento.imagen_url} alt={evento.nombre_evento} />
                            <div className="evento-vendido-info">
                              <h3>{evento.nombre_evento}</h3>
                              <p className="tipo-evento">{evento.tipo_evento}</p>
                              <div className="stats-grid-mini">
                                <div className="stat-mini">
                                  <span className="label">Funciones:</span>
                                  <span className="value">{evento.total_funciones}</span>
                                </div>
                                <div className="stat-mini">
                                  <span className="label">Boletos:</span>
                                  <span className="value">{evento.total_boletos_vendidos}</span>
                                </div>
                                <div className="stat-mini">
                                  <span className="label">Recaudación:</span>
                                  <span className="value">{formatCurrency(evento.total_recaudacion)}</span>
                                </div>
                                <div className="stat-mini">
                                  <span className="label">Promedio:</span>
                                  <span className="value">{Math.round(evento.promedio_boletos_por_funcion)} bol/func</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-message">No hay datos de eventos en el periodo seleccionado</p>
                    )}
                  </div>

                  {/* Métodos de Pago */}
                  <div className="reporte-section">
                    <h2>💳 Métodos de Pago</h2>
                    {reportesData.estadisticasGenerales.metodosPago.length > 0 ? (
                      <div className="metodos-pago-grid">
                        {reportesData.estadisticasGenerales.metodosPago.map((metodo: any) => (
                          <div key={metodo.nombre_metodo} className="metodo-pago-card">
                            <h3>{metodo.nombre_metodo}</h3>
                            <p className="metodo-total">{formatCurrency(metodo.monto_total)}</p>
                            <p className="metodo-usos">{metodo.total_usos} transacciones</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-message">No hay datos de métodos de pago</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <BarChart3 className="empty-icon" />
                  <h3>Reportes</h3>
                  <p>Selecciona un rango de fechas y haz clic en "Actualizar Reportes"</p>
                </div>
              )}
            </div>
          )}

          {/* Seats.io Configuration */}
          {currentSection === 'seatsio' && (
            <div className="seatsio-config-section">
              <div className="section-header">
                <h1 className="section-title">Configuración de Seats.io</h1>
                <p className="section-subtitle">Gestión automática de mapas de asientos</p>
              </div>

              {/* Estado de configuración */}
              <div className="seatsio-status-card">
                <h3>🔧 Estado de Configuración</h3>
                {seatsioConfig?.isConfigured ? (
                  <div className="status-ok">
                    <p>✅ <strong>Seats.io está configurado correctamente</strong></p>
                    <p>Public Key: <code>{seatsioConfig.publicKey}</code></p>
                    <p>Región: <code>{seatsioConfig.region}</code></p>
                  </div>
                ) : (
                  <div className="status-error">
                    <p>❌ <strong>Seats.io no está configurado</strong></p>
                    <p>Configura las variables de entorno en el backend (ver CONFIGURAR_ENV.md)</p>
                  </div>
                )}
              </div>

              {/* Seleccionar Chart por defecto */}
              <div className="chart-selection-card">
                <h3>🗺️ Seleccionar Chart por Defecto</h3>
                <p>Selecciona el mapa de asientos que se usará automáticamente para nuevos eventos</p>
                
                {seatsioCharts.length > 0 ? (
                  <div className="charts-grid">
                    {seatsioCharts.map((chart: any) => {
                      const isDefault = seatsioConfig?.config?.find(
                        (c: any) => c.config_key === 'default_chart_key'
                      )?.config_value === chart.key;
                      
                      return (
                        <div 
                          key={chart.key} 
                          className={`chart-card ${isDefault ? 'chart-default' : ''}`}
                          onClick={() => handleSaveDefaultChart(chart.key)}
                        >
                          {chart.publishedVersionThumbnailUrl && (
                            <img 
                              src={chart.publishedVersionThumbnailUrl} 
                              alt={chart.name}
                              className="chart-thumbnail"
                            />
                          )}
                          <div className="chart-info">
                            <h4>{chart.name}</h4>
                            <p className="chart-key">{chart.key}</p>
                            {isDefault && <span className="badge-default">Por Defecto</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-charts">
                    <p>No hay charts disponibles en Seats.io</p>
                    <p>Crea un chart en <a href="https://app.seats.io" target="_blank" rel="noopener noreferrer">app.seats.io</a></p>
                  </div>
                )}
              </div>

              {/* Sincronización automática */}
              <div className="sync-card">
                <h3>🔄 Sincronización Automática</h3>
                <p>Crea automáticamente eventos en Seats.io para todas las funciones que no los tengan</p>
                
                <button 
                  className="btn-sync"
                  onClick={handleSyncAllFunctions}
                  disabled={syncing || !seatsioConfig?.isConfigured}
                >
                  {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Todas las Funciones'}
                </button>

                <div className="sync-info">
                  <h4>¿Cómo funciona?</h4>
                  <ul>
                    <li>Se revisan todas las funciones sin evento de Seats.io</li>
                    <li>Se crea automáticamente un evento para cada función</li>
                    <li>Se usa el chart por defecto configurado arriba</li>
                    <li>Los eventos se nombran automáticamente basándose en el evento y función</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Modal de edición de eventos */}
          {isEventoModalOpen && editingEvento && (
            <div className="modal-overlay" onClick={() => setIsEventoModalOpen(false)}>
              <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>✏️ Editar Evento</h2>
                  <button className="modal-close" onClick={() => setIsEventoModalOpen(false)}>×</button>
                </div>
                
                <div className="modal-body">
                  {/* Información del evento */}
                  <form onSubmit={handleSaveEvento}>
                    <h3>📋 Información del Evento</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="nombre_evento">Nombre del Evento *</label>
                        <input
                          type="text"
                          id="nombre_evento"
                          name="nombre_evento"
                          defaultValue={editingEvento.nombre_evento}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="id_tipo_evento">Categoría *</label>
                        <select
                          id="id_tipo_evento"
                          name="id_tipo_evento"
                          defaultValue={editingEvento.id_tipo_evento}
                          required
                        >
                          {tiposEvento.map((tipo: any) => (
                            <option key={tipo.id_tipo_evento} value={tipo.id_tipo_evento}>
                              {tipo.nombre_tipo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="descripcion">Descripción</label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        rows={3}
                        defaultValue={editingEvento.descripcion}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="imagen_url">URL de Imagen</label>
                      <input
                        type="url"
                        id="imagen_url"
                        name="imagen_url"
                        defaultValue={editingEvento.imagen_url}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="clasificacion">Clasificación</label>
                        <select id="clasificacion" name="clasificacion" defaultValue={editingEvento.clasificacion}>
                          <option value="Todo Público">Todo Público</option>
                          <option value="Mayor 12">Mayor 12</option>
                          <option value="Mayor 15">Mayor 15</option>
                          <option value="Mayor 18">Mayor 18</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="fecha_inicio">Fecha Inicio *</label>
                        <input
                          type="datetime-local"
                          id="fecha_inicio"
                          name="fecha_inicio"
                          defaultValue={editingEvento.fecha_inicio?.slice(0, 16)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="fecha_fin">Fecha Fin *</label>
                        <input
                          type="datetime-local"
                          id="fecha_fin"
                          name="fecha_fin"
                          defaultValue={editingEvento.fecha_fin?.slice(0, 16)}
                          required
                        />
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button type="submit" className="btn-save">
                        💾 Guardar Evento
                      </button>
                    </div>
                  </form>

                  {/* Funciones del evento */}
                  <div className="functions-management">
                    <h3>🎭 Funciones (Vincular con Auditorios)</h3>
                    
                    {/* Lista de funciones existentes */}
                    {eventFunctions.length > 0 ? (
                      <div className="functions-list">
                        <table className="functions-table">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Hora</th>
                              <th>Auditorio</th>
                              <th>Sede</th>
                              <th>Capacidad</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {eventFunctions.map((func) => {
                              const fecha = new Date(func.fecha_hora);
                              return (
                              <tr key={func.id_funcion}>
                                <td>{fecha.toLocaleDateString('es-MX')}</td>
                                <td>{fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{func.nombre_auditorio || 'N/A'}</td>
                                <td>{func.nombre_sede || 'N/A'}</td>
                                <td>{func.capacidad_total || 0}</td>
                                <td>
                                  <button
                                    className="btn-action delete small"
                                    onClick={() => handleDeleteFunction(func.id_funcion)}
                                    title="Eliminar función"
                                  >
                                    <Trash2 className="icon" />
                                  </button>
                                </td>
                              </tr>
                            );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="no-functions-message">No hay funciones creadas aún</p>
                    )}

                    {/* Formulario para crear nueva función */}
                    <form onSubmit={handleCreateFunction} className="create-function-form">
                      <h4>➕ Agregar Nueva Función</h4>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="func_fecha">Fecha *</label>
                          <input
                            type="date"
                            id="func_fecha"
                            name="fecha"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="func_hora">Hora *</label>
                          <input
                            type="time"
                            id="func_hora"
                            name="hora"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="func_auditorio">Auditorio *</label>
                          <select
                            id="func_auditorio"
                            name="id_auditorio"
                            required
                          >
                            <option value="">Seleccionar auditorio...</option>
                            {auditorios.map((aud) => (
                              <option key={aud.id_auditorio} value={aud.id_auditorio}>
                                {aud.nombre} - {aud.nombre_sede} ({aud.capacidad} personas)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button type="submit" className="btn-save">
                        ➕ Crear Función
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de edición de precio */}
          {isPrecioModalOpen && editingPrecio && (
            <div className="modal-overlay" onClick={() => setIsPrecioModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>💰 Editar Precio</h2>
                  <button className="modal-close" onClick={() => setIsPrecioModalOpen(false)}>×</button>
                </div>
                
                <div className="modal-body">
                  <div className="modal-info">
                    <h3>{editingPrecio.nombre_tipo}</h3>
                    <p><strong>Zona:</strong> {editingPrecio.nombre_zona}</p>
                    <p><strong>Auditorio:</strong> {editingPrecio.auditorio_nombre}</p>
                    <p><strong>Sede:</strong> {editingPrecio.nombre_sede}</p>
                    <p className="current-price">Precio actual: <strong>${editingPrecio.precio_base.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></p>
                  </div>

                  <form onSubmit={handleSavePrecio}>
                    <div className="form-group">
                      <label htmlFor="precio_base">Nuevo Precio Base (MXN) *</label>
                      <input
                        type="number"
                        id="precio_base"
                        name="precio_base"
                        defaultValue={editingPrecio.precio_base}
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        style={{ fontSize: '1.2rem', fontWeight: '600' }}
                      />
                      <span className="field-hint">Ingresa el precio en pesos mexicanos</span>
                    </div>

                    <div className="modal-actions">
                      <button type="button" className="btn-cancel" onClick={() => setIsPrecioModalOpen(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-save">
                        💾 Guardar Precio
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Modal de creación de evento */}
          {isCreateEventoModalOpen && (
            <div className="modal-overlay" onClick={() => setIsCreateEventoModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>➕ Crear Nuevo Evento</h2>
                  <button className="modal-close" onClick={() => setIsCreateEventoModalOpen(false)}>×</button>
                </div>
                
                <div className="modal-body">
                  <form onSubmit={handleCreateEvento}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="nombre_evento_new">Nombre del Evento *</label>
                        <input
                          type="text"
                          id="nombre_evento_new"
                          name="nombre_evento"
                          required
                          placeholder="Ej: Concierto de Rock"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="id_tipo_evento_new">Categoría *</label>
                        <select
                          id="id_tipo_evento_new"
                          name="id_tipo_evento"
                          required
                        >
                          <option value="">Seleccionar categoría...</option>
                          {tiposEvento.map((tipo: any) => (
                            <option key={tipo.id_tipo_evento} value={tipo.id_tipo_evento}>
                              {tipo.nombre_tipo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="descripcion_new">Descripción</label>
                      <textarea
                        id="descripcion_new"
                        name="descripcion"
                        rows={3}
                        placeholder="Describe el evento..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="imagen_url_new">URL de Imagen</label>
                      <input
                        type="url"
                        id="imagen_url_new"
                        name="imagen_url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="clasificacion_new">Clasificación</label>
                        <select id="clasificacion_new" name="clasificacion" defaultValue="Todo Público">
                          <option value="Todo Público">Todo Público</option>
                          <option value="Mayor 12">Mayor 12</option>
                          <option value="Mayor 15">Mayor 15</option>
                          <option value="Mayor 18">Mayor 18</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="fecha_inicio_new">Fecha Inicio *</label>
                        <input
                          type="datetime-local"
                          id="fecha_inicio_new"
                          name="fecha_inicio"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="fecha_fin_new">Fecha Fin *</label>
                        <input
                          type="datetime-local"
                          id="fecha_fin_new"
                          name="fecha_fin"
                          required
                        />
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button type="button" className="btn-cancel" onClick={() => setIsCreateEventoModalOpen(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-save">
                        💾 Crear Evento
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Modal de edición de auditorio */}
          {isEditModalOpen && editingAuditorio && (
            <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Configurar Seats.io</h2>
                  <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>×</button>
                </div>
                
                <div className="modal-body">
                  <div className="modal-info">
                    <h3>{editingAuditorio.nombre}</h3>
                    <p>{editingAuditorio.nombre_sede} - {editingAuditorio.ciudad}</p>
                    <p className="capacity">Capacidad: {editingAuditorio.capacidad} personas</p>
                  </div>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const seatsioEventKey = formData.get('seatsio_event_key') as string;
                    const seatsioPublicKey = formData.get('seatsio_public_key') as string;

                    try {
                      await auditoriosService.updateSeatsioConfig(
                        editingAuditorio.id_auditorio,
                        {
                          seatsio_event_key: seatsioEventKey || undefined,
                          seatsio_public_key: seatsioPublicKey || undefined
                        }
                      );
                      
                      alert('✅ Configuración de Seats.io actualizada correctamente');
                      setIsEditModalOpen(false);
                      loadAuditorios(); // Recargar auditorios
                    } catch (error: any) {
                      alert('❌ Error al actualizar configuración: ' + (error.response?.data?.error || error.message));
                    }
                  }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                        Método de Configuración
                      </label>
                      <div style={{ display: 'flex', gap: '1.5rem', padding: '0.5rem 0' }}>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'white' }}>
                            <input 
                                type="radio" 
                                name="config_mode"
                                checked={seatsioInputMode === 'select'} 
                                onChange={() => setSeatsioInputMode('select')} 
                            /> 
                            Seleccionar Chart (API)
                         </label>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'white' }}>
                            <input 
                                type="radio" 
                                name="config_mode"
                                checked={seatsioInputMode === 'manual'} 
                                onChange={() => setSeatsioInputMode('manual')} 
                            /> 
                            Manual (Key)
                         </label>
                      </div>
                    </div>

                    {seatsioInputMode === 'select' ? (
                      <div className="form-group">
                        <label htmlFor="seatsio_event_key_select">
                          Seleccionar Chart de Seats.io *
                          <span className="field-hint">Se vinculará este auditorio con el Chart seleccionado</span>
                        </label>
                        <select
                          id="seatsio_event_key_select"
                          name="seatsio_event_key"
                          defaultValue={editingAuditorio.seatsio_event_key || ''}
                          required={seatsioInputMode === 'select'}
                          style={{ 
                            width: '100%', 
                            padding: '0.875rem 1rem', 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            border: '1px solid rgba(255, 255, 255, 0.2)', 
                            borderRadius: '8px', 
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">-- Seleccionar Chart --</option>
                          {seatsioCharts.map((chart: any) => (
                            <option key={chart.key} value={chart.key}>
                              {chart.name}
                            </option>
                          ))}
                        </select>
                        {seatsioCharts.length === 0 && (
                          <p className="field-hint" style={{ color: '#ff9800' }}>
                            ⚠️ No se encontraron charts. Verifica la configuración de API Keys en la sección Seats.io Config.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="form-group">
                        <label htmlFor="seatsio_event_key">
                          Key de Seats.io *
                          <span className="field-hint">Event Key o Chart Key</span>
                        </label>
                        <input
                          type="text"
                          id="seatsio_event_key"
                          name="seatsio_event_key"
                          defaultValue={editingAuditorio.seatsio_event_key || ''}
                          placeholder="Pegar Key aquí"
                          required={seatsioInputMode === 'manual'}
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="seatsio_public_key">
                        Public Key de Seats.io (Opcional)
                        <span className="field-hint">Si está vacío, se usará la clave pública global</span>
                      </label>
                      <input
                        type="text"
                        id="seatsio_public_key"
                        name="seatsio_public_key"
                        defaultValue={editingAuditorio.seatsio_public_key || ''}
                        placeholder="Public Key (opcional)"
                      />
                    </div>

                    <div className="modal-actions">
                      <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-save">
                        Guardar Configuración
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

