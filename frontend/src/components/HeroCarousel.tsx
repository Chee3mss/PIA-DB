import { useState, useEffect } from 'react';
import '../styles/HeroCarousel.css';

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  imageUrl?: string;
  buttonText?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function HeroCarousel({ 
  slides, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length, resetKey]);



  return (
    <div className="hero-carousel">
      <div className="hero-carousel-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            {(slide.image || slide.imageUrl) ? (
              <div 
                className="hero-slide-image"
                style={{ backgroundImage: `url(${slide.image || slide.imageUrl})` }}
              />
            ) : (
              <div 
                className="hero-slide-gradient"
                style={{
                  background: `linear-gradient(135deg, 
                    hsl(${index * 60}, 70%, 50%) 0%, 
                    hsl(${index * 60 + 30}, 60%, 40%) 100%)`
                }}
              />
            )}
            
            <div className="hero-slide-content">
              <div className="hero-slide-text">
                <p className="hero-slide-subtitle">{slide.subtitle}</p>
                <h1 className="hero-slide-title">{slide.title}</h1>
                <p className="hero-slide-description">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

