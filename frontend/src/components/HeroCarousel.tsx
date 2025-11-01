import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/HeroCarousel.css';

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
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

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setResetKey((prev) => prev + 1); // Reset autoplay timer
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setResetKey((prev) => prev + 1); // Reset autoplay timer
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setResetKey((prev) => prev + 1); // Reset autoplay timer
  };

  return (
    <div className="hero-carousel">
      <div className="hero-carousel-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            {slide.image ? (
              <div 
                className="hero-slide-image"
                style={{ backgroundImage: `url(${slide.image})` }}
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
                {slide.buttonText && (
                  <button className="hero-slide-button">
                    {slide.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button 
          className="hero-nav-btn hero-nav-prev"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} />
        </button>
        
        <button 
          className="hero-nav-btn hero-nav-next"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight size={32} />
        </button>

        {/* Dots Indicator */}
        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

