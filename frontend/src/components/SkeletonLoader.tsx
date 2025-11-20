import React from 'react';
import '../styles/SkeletonLoader.css';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-page">
      {/* Hero Section Skeleton */}
      <div className="skeleton-hero-section">
        <div className="skeleton-hero-overlay"></div>
        <div className="skeleton-hero-content">
          <div className="skeleton-hero-subtitle"></div>
          <div className="skeleton-hero-title"></div>
          <div className="skeleton-hero-desc"></div>
          <div className="skeleton-hero-btn"></div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="skeleton-content-container">
        {/* Simulamos 2 filas de categorías */}
        {[1, 2].map((section) => (
          <div key={section}>
            {/* Category Title */}
            <div className="skeleton-category-header">
              <div className="skeleton-title-bar skeleton-pulse"></div>
              <div className="skeleton-category-title skeleton-pulse"></div>
            </div>

            {/* Cards Row */}
            <div className="skeleton-carousel-row">
              {[1, 2, 3, 4].map((card) => (
                <div key={card} className="skeleton-card">
                  {/* Image Area */}
                  <div className="skeleton-card-image skeleton-pulse"></div>
                  
                  {/* Content Area */}
                  <div className="skeleton-card-content">
                    <div className="skeleton-card-tag skeleton-pulse"></div>
                    <div className="skeleton-card-title skeleton-pulse"></div>
                    <div className="skeleton-card-text skeleton-pulse"></div>
                    <div className="skeleton-card-text-short skeleton-pulse"></div>
                    <div className="skeleton-card-location skeleton-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
