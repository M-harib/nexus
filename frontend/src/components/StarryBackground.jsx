import React, { useEffect, useState, useRef } from 'react';

const MAX_STARS = 30;
const METEOR_ANGLE_DEG = 22.6;
const METEOR_ANGLE_RAD = (METEOR_ANGLE_DEG * Math.PI) / 180;
// Delay meteors until after main screen is fully visible (sidebar animations take ~1s)
const METEOR_INITIAL_DELAY = 2.5; // seconds

function createStar(id) {
  const pulseDuration = 3 + Math.random() * 3;
  const pulseCount = 3 + Math.floor(Math.random() * 4);
  const totalLife = pulseDuration * pulseCount;
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    pulseDuration,
    totalLife,
    createdAt: Date.now(),
  };
}

function createMeteor(id) {
  // Get screen dimensions
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const fromTop = Math.random() > 0.5;

  // Random start position along top 80% or left 80% edge
  let startX, startY;
  if (fromTop) {
    // Spawn from top 80% of screen width
    startX = -100 + Math.random() * (screenW * 0.8 + 100);
    startY = -50 - Math.random() * 50; // -50 to -100
  } else {
    // Spawn from left 80% of screen height
    startX = -50 - Math.random() * 50; // -50 to -100
    startY = -100 + Math.random() * (screenH * 0.8 + 100);
  }

  // At 22.6°, the meteor moves at angle from the horizontal
  // dx per unit distance = cos(22.6°), dy per unit distance = sin(22.6°)
  // We need to find how far it must travel to go offscreen (bottom-right)
  const cosA = Math.cos(METEOR_ANGLE_RAD);
  const sinA = Math.sin(METEOR_ANGLE_RAD);

  // Calculate distance needed to exit the screen
  // Meteor needs to reach either right edge or bottom edge
  const distToRight = cosA > 0 ? (screenW - startX + 200) / cosA : Infinity;
  const distToBottom = sinA > 0 ? (screenH - startY + 200) / sinA : Infinity;
  const totalDist = Math.min(distToRight, distToBottom);

  // Calculate the actual x and y travel distances
  const travelX = totalDist * cosA;
  const travelY = totalDist * sinA;

  return {
    id,
    duration: 5 + Math.random() * 3,
    delay: METEOR_INITIAL_DELAY + Math.random() * 18,
    initialOpacity: 0.3 + Math.random() * 0.7,
    scale: 0.5 + Math.random() * 0.9,
    startX,
    startY,
    travelX,
    travelY,
  };
}

function StarryBackground({ hideMeteors = false }) {
  const nextId = useRef(0);
  const [twinkleStars, setTwinkleStars] = useState(() => {
    const stars = [];
    for (let i = 0; i < MAX_STARS; i++) {
      const star = createStar(nextId.current++);
      star.createdAt = Date.now() + Math.random() * 10000;
      stars.push(star);
    }
    return stars;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTwinkleStars(prev => {
        const now = Date.now();
        return prev.map(star => {
          const elapsed = (now - star.createdAt) / 1000;
          if (elapsed > star.totalLife) {
            return createStar(nextId.current++);
          }
          return star;
        });
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [meteors, setMeteors] = useState([]);
  const meteorIdRef = useRef(0);

  // Delay meteor generation until after sidebar animations complete
  useEffect(() => {
    const timer = setTimeout(() => {
      const m = [];
      for (let i = 0; i < 8; i++) {
        m.push(createMeteor(meteorIdRef.current++));
      }
      setMeteors(m);
    }, METEOR_INITIAL_DELAY * 1000);
    return () => clearTimeout(timer);
  }, []);

  // Regenerate each meteor individually after its animation completes
  useEffect(() => {
    if (meteors.length === 0) return;
    
    const timers = meteors.map((meteor) => {
      const totalDuration = (meteor.delay + meteor.duration) * 1000;
      return setTimeout(() => {
        setMeteors(prev => 
          prev.map(m => m.id === meteor.id ? createMeteor(meteorIdRef.current++) : m)
        );
      }, totalDuration);
    });
    
    return () => timers.forEach(clearTimeout);
  }, [meteors]);

  return (
    <div className="starry-background">
      {twinkleStars.map(star => (
        <div
          key={star.id}
          className="bg-twinkle-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--pulse-duration': `${star.pulseDuration}s`,
            '--total-life': `${star.totalLife}s`,
            animation: `star-pulse ${star.pulseDuration}s ease-in-out infinite, star-lifecycle ${star.totalLife}s ease-in-out forwards`,
          }}
        />
      ))}
      {!hideMeteors && meteors.map(m => (
        <div
          key={m.id}
          className="meteor"
          style={{
            top: `${m.startY}px`,
            left: `${m.startX}px`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            '--travel-x': `${m.travelX}px`,
            '--travel-y': `${m.travelY}px`,
            '--scale': m.scale,
            '--initial-opacity': m.initialOpacity,
          }}
        />
      ))}
    </div>
  );
}

export default StarryBackground;
