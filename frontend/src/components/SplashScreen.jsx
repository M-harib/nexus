import React, { useState, useEffect, useRef } from 'react';

function SplashScreen({ onComplete }) {
  const [showHint, setShowHint] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [stars, setStars] = useState([]);
  const [streamStars, setStreamStars] = useState([]);
  
  const timersRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      // Clear all timers on unmount
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const generateStars = () => {
    const starCount = 50;
    const newStars = [];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: (i / starCount) * 6,
      });
    }
    return newStars;
  };

  const generateStreamStars = () => {
    const count = 80;
    const newStars = [];
    for (let i = 0; i < count; i++) {
      newStars.push({
        id: 1000 + i,
        x: Math.random() * 100,
        startY: -(Math.random() * 120),
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 0.8,
        duration: 1.0 + Math.random() * 0.6,
        streak: 8 + Math.random() * 25,
      });
    }
    return newStars;
  };

  const startExit = () => {
    setExiting(true);
    setStreamStars(generateStreamStars());
    const t = setTimeout(() => onComplete(), 2000);
    timersRef.current.push(t);
  };

  const skipToSecondText = () => {
    // Clear pending timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    
    setFadingOut(true);
    const t1 = setTimeout(() => {
      setFadingOut(false);
      setShowSecondText(true);
      // After showing second text, schedule exit
      const t2 = setTimeout(startExit, 4000);
      timersRef.current.push(t2);
    }, 1000);
    timersRef.current.push(t1);
  };

  const skipToExit = () => {
    // Clear pending timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    
    startExit();
  };

  const handleClick = () => {
    if (exiting) return; // Already exiting, can't skip
    
    if (!clicked) {
      // First click: start the sequence
      setClicked(true);
      setStars(generateStars());

      const t1 = setTimeout(() => setFadingOut(true), 5000);
      const t2 = setTimeout(() => {
        setFadingOut(false);
        setShowSecondText(true);
      }, 6000);
      const t3 = setTimeout(startExit, 10000);
      
      timersRef.current.push(t1, t2, t3);
    } else if (!showSecondText && !fadingOut) {
      // Second click: skip to second text
      skipToSecondText();
    } else if (showSecondText && !exiting) {
      // Third click: skip to exit
      skipToExit();
    }
  };

  const getText = () => {
    if (!clicked) return "Ready to start learning?";
    if (showSecondText) return "The stars will guide your way";
    return "Let's begin your learning journey";
  };

  return (
    <div
      className={`splash-screen ${exiting ? 'splash-exit' : ''}`}
      onClick={handleClick}
    >
      {stars.map(star => (
        <div
          key={star.id}
          className={`splash-star-gradual ${exiting ? 'star-look-up' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: exiting ? '0s' : `${star.delay}s`,
            '--star-streak': `${Math.max(star.size * 8, 15)}px`,
          }}
        />
      ))}
      {streamStars.map(star => (
        <div
          key={star.id}
          className="stream-star"
          style={{
            left: `${star.x}%`,
            top: `${star.startY}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            '--streak-len': `${star.streak}px`,
          }}
        />
      ))}
      <div className="splash-content">
        <h1
          key={showSecondText ? 'second' : clicked ? 'first' : 'initial'}
          className={`splash-title ${!clicked ? 'animate-gentle-pulse' : fadingOut ? 'splash-title-fade-out' : 'splash-title-transition'}`}
        >
          {getText()}
        </h1>
        {!clicked && (
          <p className={`splash-hint ${showHint ? 'splash-hint-visible' : ''}`}>
            click to begin
          </p>
        )}
      </div>
    </div>
  );
}

export default SplashScreen;
