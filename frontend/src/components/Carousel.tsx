import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/Carousel.css';

interface CarouselProps {
  title: string;
  items: CarouselItem[];
}

export interface CarouselItem {
  id: number;
  title: string;
  image?: string;
  imageUrl?: string;
  description?: string;
  location?: string;
  category?: string; // Nueva propiedad opcional
}

const Carousel: React.FC<CarouselProps> = ({ title, items }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4; // Number of items visible at once

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < items.length - itemsPerView ? prevIndex + 1 : prevIndex
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const canGoNext = currentIndex < items.length - itemsPerView;
  const canGoPrev = currentIndex > 0;

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-container">
        <button
          className="carousel-btn carousel-btn-prev"
          onClick={prevSlide}
          disabled={!canGoPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="carousel-wrapper">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {items.map((item) => (
              <div 
                key={item.id} 
                className="carousel-item"
                onClick={() => navigate(`/event/${item.id}`)}
              >
                <div className="carousel-item-content">
                  <div className="carousel-item-image-container">
                    {(item.image || item.imageUrl) ? (
                      <img
                        src={item.image || item.imageUrl}
                        alt={item.title}
                        className="carousel-item-image"
                        onError={(e) => {
                          console.error('Error cargando imagen:', item.image || item.imageUrl);
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            const placeholder = parent.querySelector('.carousel-item-placeholder');
                            if (placeholder) {
                              (placeholder as HTMLElement).style.display = 'flex';
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div className="carousel-item-placeholder" style={{ display: (item.image || item.imageUrl) ? 'none' : 'flex' }}>
                      <span>{item.title.charAt(0)}</span>
                    </div>
                  </div>
                  
                  <div className="carousel-item-details">
                    {item.category && (
                      <span className="carousel-item-category">{item.category}</span>
                    )}
                    <h3 className="carousel-item-title">{item.title}</h3>
                    {item.description && (
                      <p className="carousel-item-description">
                        {item.description}
                      </p>
                    )}
                    <div className="carousel-item-meta">
                      {item.location && (
                        <div className="carousel-item-location">
                          <MapPin size={16} />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="carousel-btn carousel-btn-next"
          onClick={nextSlide}
          disabled={!canGoNext}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Carousel;

