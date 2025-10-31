import React, { useState } from 'react';
import '../styles/Carousel.css';

interface CarouselProps {
  title: string;
  items: CarouselItem[];
}

export interface CarouselItem {
  id: number;
  title: string;
  image?: string;
  description?: string;
}

const Carousel: React.FC<CarouselProps> = ({ title, items }) => {
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
          &#8249;
        </button>
        <div className="carousel-wrapper">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {items.map((item) => (
              <div key={item.id} className="carousel-item">
                <div className="carousel-item-content">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="carousel-item-image"
                    />
                  ) : (
                    <div className="carousel-item-placeholder">
                      <span>{item.title.charAt(0)}</span>
                    </div>
                  )}
                  <h3 className="carousel-item-title">{item.title}</h3>
                  {item.description && (
                    <p className="carousel-item-description">
                      {item.description}
                    </p>
                  )}
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
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default Carousel;

