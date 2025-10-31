import Carousel from './Carousel'
import Topbar from './TopBar';
import type { CarouselItem } from './Carousel'
import '../styles/Welcome.css'

export default function Welcome() {
    // Example data for carousels
    const popularItems: CarouselItem[] = [
        { id: 1, title: "Evento Pop 1", description: "Descubre la música pop del momento" },
        { id: 2, title: "Evento Pop 2", description: "Los mejores artistas en vivo" },
        { id: 3, title: "Evento Pop 3", description: "Una noche inolvidable te espera" },
        { id: 4, title: "Evento Pop 4", description: "Reserva tu lugar ahora" },
        { id: 5, title: "Evento Pop 5", description: "Experiencia única garantizada" },
        { id: 6, title: "Evento Pop 6", description: "Únete a la fiesta" },
    ];

    const trendingItems: CarouselItem[] = [
        { id: 7, title: "Electrónica 2025", description: "Las mejores pistas electrónicas" },
        { id: 8, title: "Festival Urbano", description: "Música urbana en su máximo esplendor" },
        { id: 9, title: "Rock Clásico Live", description: "Revive los clásicos del rock" },
        { id: 10, title: "Jazz Session", description: "Sofisticación y elegancia musical" },
        { id: 11, title: "Hip-Hop Night", description: "El mejor hip-hop en directo" },
        { id: 12, title: "Reggaeton Party", description: "La fiesta más caliente" },
    ];

    const upcomingItems: CarouselItem[] = [
        { id: 13, title: "Concierto Sinfónico", description: "Música clásica en grande" },
        { id: 14, title: "Stand-Up Comedy", description: "Risas garantizadas" },
        { id: 15, title: "Danza Contemporánea", description: "Arte en movimiento" },
        { id: 16, title: "Open Mic Night", description: "Talento local" },
        { id: 17, title: "Festival de Cine", description: "Cine independiente" },
        { id: 18, title: "Exposición Arte", description: "Galardonado" },
    ];

    const featuredItems: CarouselItem[] = [
        { id: 19, title: "Evento VIP", description: "Acceso exclusivo premium" },
        { id: 20, title: "Noche de Gala", description: "Elegancia y distinción" },
        { id: 21, title: "After Party", description: "La fiesta continúa" },
        { id: 22, title: "Sunset Sessions", description: "Música al atardecer" },
        { id: 23, title: "Brunch Acústico", description: "Mañanas musicales" },
        { id: 24, title: "Late Night Show", description: "Hasta el amanecer" },
    ];

    return (
      <>
        <Topbar/>
        <main>
          <Carousel title="🎵 Populares" items={popularItems} />
          <Carousel title="🔥 En Tendencia" items={trendingItems} />
          <Carousel title="📅 Próximamente" items={upcomingItems} />
          <Carousel title="⭐ Destacados" items={featuredItems} />
        </main>
        <footer>
          <p>© 2025 StageGo. All rights reserved.</p>
        </footer>
        </>
    )
}