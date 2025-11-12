import { useState, useEffect } from 'react';
import Carousel from './Carousel'
import HeroCarousel from './HeroCarousel';
import Topbar from './TopBar';
import type { CarouselItem } from './Carousel'
import type { HeroSlide } from './HeroCarousel'
import { carouselService, eventosService } from '../services/api';
import type { Evento, Categoria } from '../services/api';
import '../styles/Welcome.css'

export default function Welcome() {
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

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
            console.log('Evento:', evento.nombre_evento, 'Imagen:', evento.imagen_url);
            return {
                id: evento.id_evento,
                title: evento.nombre_evento,
                description: evento.clasificacion || evento.descripcion?.substring(0, 50),
                imageUrl: evento.imagen_url
            };
        });
    };

    // Filtrar eventos por categoría
    const getEventosByCategoria = (idCategoria: number): CarouselItem[] => {
        const eventosFiltrados = eventos.filter(e => e.id_tipo_evento === idCategoria);
        return eventosToCarouselItems(eventosFiltrados);
    };

    if (loading) {
        return (
            <>
                <Topbar/>
                <div style={{ 
                    minHeight: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#f5f5f5'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2>Cargando eventos...</h2>
                        <p>Por favor espera un momento</p>
                    </div>
                </div>
            </>
        );
    }

    return (
      <>
        <Topbar/>
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
                  
                  console.log(`Categoría: ${categoria.nombre_tipo}, Items: ${items.length}`);
                  items.forEach(item => {
                    console.log(`  - ${item.title}, Imagen: ${item.imageUrl || 'SIN IMAGEN'}`);
                  });
                  
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
                <h2>Cargando eventos...</h2>
                <p>Total eventos cargados: {eventos.length}</p>
                <p>Total categorías: {categorias.length}</p>
            </div>
          )}
        </main>
        <footer>
          <p>© 2025 StageGo. All rights reserved.</p>
        </footer>
      </>
    )
}