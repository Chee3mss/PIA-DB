import { useState, useEffect } from 'react';
import Carousel from './Carousel'
import HeroCarousel from './HeroCarousel';
import Topbar from './TopBar';
import type { CarouselItem } from './Carousel'
import type { HeroSlide } from './HeroCarousel'
import { carouselService, eventosService } from '../services/api';
import type { Evento, Categoria } from '../services/api';
import SkeletonLoader from './SkeletonLoader';
import '../styles/Welcome.css'

export default function Welcome() {
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState('México');

    // Cargar datos al montar el componente
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Cargar carousel slides
            const slides = await carouselService.getSlides();
            setHeroSlides(slides.map(slide => ({
                id: slide.id,
                subtitle: slide.subtitle,
                title: slide.title,
                description: slide.description,
                buttonText: slide.buttonText,
                imageUrl: slide.imageUrl
            })));

            // Cargar eventos
            const eventosData = await eventosService.getEventos();
            setEventos(eventosData);

            // Cargar categorías
            const categoriasData = await eventosService.getCategorias();
            setCategorias(categoriasData);

        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Convertir eventos a CarouselItems
    const eventosToCarouselItems = (eventos: Evento[]): CarouselItem[] => {
        return eventos.map(evento => {
            // Construir string de ubicación
            let locationStr = 'Ubicación por confirmar';
            
            // Si hay múltiples ciudades (gira), usar eso
            if (evento.ciudades && evento.ciudades.includes(',')) {
                locationStr = 'Gira Nacional';
            } else if (evento.lugar) {
                locationStr = evento.lugar;
                if (evento.ciudad) locationStr += `, ${evento.ciudad}`;
            } else if (evento.ciudad) {
                locationStr = evento.ciudad;
                if (evento.estado) locationStr += `, ${evento.estado}`;
            }

            return {
                id: evento.id_evento,
                title: evento.nombre_evento,
                description: evento.clasificacion || evento.descripcion?.substring(0, 50),
                imageUrl: evento.imagen_url,
                location: locationStr,
                category: evento.categoria // Asegúrate de que el backend devuelva esto (ya lo hace)
            };
        });
    };

    // Filtrar eventos por categoría
    const getEventosByCategoria = (idCategoria: number): CarouselItem[] => {
        let eventosFiltrados = eventos.filter(e => e.id_tipo_evento === idCategoria);
        
        // Filtrar por ubicación si no es "México" (que asumimos como "Todos")
        if (selectedLocation && selectedLocation !== 'México') {
            eventosFiltrados = eventosFiltrados.filter(e => {
                // Normalizar para comparación
                const loc = selectedLocation.toLowerCase();
                const estado = e.estado?.toLowerCase() || '';
                const ciudad = e.ciudad?.toLowerCase() || '';
                const ciudades = e.ciudades?.toLowerCase() || '';
                
                // Verificar si la ciudad buscada está en la lista de ciudades del evento (para giras)
                return estado.includes(loc) || ciudad.includes(loc) || ciudades.includes(loc);
            });
        }

        return eventosToCarouselItems(eventosFiltrados);
    };

    if (loading) {
        return (
            <>
                <Topbar selectedLocation={selectedLocation} onLocationChange={setSelectedLocation}/>
                <SkeletonLoader />
            </>
        );
    }

    return (
      <>
        <Topbar selectedLocation={selectedLocation} onLocationChange={setSelectedLocation}/>
        {heroSlides.length > 0 && (
            <HeroCarousel slides={heroSlides} autoPlay={true} autoPlayInterval={5000} />
        )}
        <main>
          {/* Mostrar categorías dinámicamente */}
          {categorias.length > 0 && eventos.length > 0 ? (
            <>
              {categorias.map(categoria => {
                  const items = getEventosByCategoria(categoria.id_tipo_evento);
                  if (items.length === 0) return null;
                  
                  return (
                      <Carousel 
                          key={categoria.id_tipo_evento}
                          title={categoria.nombre_tipo} 
                          items={items} 
                      />
                  );
              })}
            </>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>No hay eventos disponibles</h2>
                <p>Intenta cambiar la ubicación o vuelve más tarde.</p>
            </div>
          )}
        </main>
        <footer>
          <p>© 2025 StageGo. All rights reserved.</p>
        </footer>
      </>
    )
}