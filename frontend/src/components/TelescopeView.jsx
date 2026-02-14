import React, { useState, useEffect } from 'react';

const CONSTELLATION_STARS = [
  { x: 40, y: 35, size: 2.5 },
  { x: 44, y: 32, size: 2 },
  { x: 49, y: 30, size: 3 },
  { x: 54, y: 33, size: 2 },
  { x: 56, y: 38, size: 2.5 },
  { x: 52, y: 42, size: 2 },
  { x: 48, y: 40, size: 3 },
];

const CONSTELLATION_LINES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 2],
];

function generateLensStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      pulseDuration: 3 + Math.random() * 3,
      delay: Math.random() * 4,
    });
  }
  return stars;
}

function TelescopeView({ query }) {
  // Phases: 'pan-up' → 'zoom-lens' → 'lens-view'
  const [phase, setPhase] = useState('pan-up');
  const [lensStars] = useState(() => generateLensStars(50));
  const [showConstellation, setShowConstellation] = useState(false);

  useEffect(() => {
    // Phase 1: Telescope slides up to eye level (3s)
    const t1 = setTimeout(() => setPhase('zoom-lens'), 3000);
    // Phase 2: Zoom into the dark lens (2.5s)
    const t2 = setTimeout(() => setPhase('lens-view'), 5500);
    // Phase 3: Show constellation
    const t3 = setTimeout(() => setShowConstellation(true), 7000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="telescope-overlay">
      {/* Phases 1-2: Telescope panning up */}
      {phase !== 'lens-view' && (
        <div className={`telescope-scene-wrap ${phase}`}>
          {/* Night sky background */}
          <div className="telescope-sky-bg">
            {lensStars.map(star => (
              <div
                key={star.id}
                className="lens-star"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDuration: `${star.pulseDuration}s`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Telescope — cylinder that tilts to eye level */}
          <div className="telescope-firstperson">
            <div className="scope-cylinder" />
          </div>
        </div>
      )}

      {/* Phase 3: Lens view — sky through telescope */}
      {phase === 'lens-view' && (
        <div className="lens-view-container">
          <div className="lens-sky">
            {lensStars.map(star => (
              <div
                key={star.id}
                className="lens-star"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDuration: `${star.pulseDuration}s`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}

            {showConstellation && (
              <svg
                className="constellation-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
              >
                {CONSTELLATION_LINES.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={CONSTELLATION_STARS[a].x}
                    y1={CONSTELLATION_STARS[a].y}
                    x2={CONSTELLATION_STARS[b].x}
                    y2={CONSTELLATION_STARS[b].y}
                    className="constellation-line"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
                {CONSTELLATION_STARS.map((star, i) => (
                  <circle
                    key={i}
                    cx={star.x}
                    cy={star.y}
                    r={star.size * 0.5}
                    className="constellation-dot"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </svg>
            )}
          </div>

          <div className="lens-vignette" />

          <div className="lens-search-text">
            <span className="lens-search-icon">🔍</span>
            <span>Searching for a constellation</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TelescopeView;
