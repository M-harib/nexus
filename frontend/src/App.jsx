import React, { useState, useRef, useCallback, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import BossFightModal from './components/BossFightModal';
import { knowledgeGraphData, getNodeColor, getLinkColor } from './data/knowledgeGraph';
import './App.css';
import Sidebar from './components/SideBar';
import Header from './components/Header';
import TextBox from './components/TextBox';
import AddMedia from './components/AddMedia';
import Greeting from './components/Greeting';
import SplashScreen from './components/SplashScreen';
import StarryBackground from './components/StarryBackground';
import ConstellationView from './components/ConstellationView';

const API_URL = 'http://localhost:5000';

function App() {
  
  const [isHovered, setIsHovered] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [showConstellation, setShowConstellation] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');

  const handleSplashComplete = () => {
    setShowSplash(false);
    requestAnimationFrame(() => setMainVisible(true));
  };

  const handlePromptSubmit = (prompt) => {
    setUserPrompt(prompt);
    setShowConstellation(true);
  };

  const handleBackToPrompt = () => {
    setShowConstellation(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete}/>;
  }

  if (showConstellation) {
    return <ConstellationView onBack={handleBackToPrompt} userPrompt={userPrompt} />;
  }

  return (
    <div className={`app-container flex h-screen w-screen bg-black text-gray-100 overflow-hidden relative ${mainVisible ? 'main-enter' : ''}`}>
      <StarryBackground />
      
      <div className="sidebar">
        <Sidebar isHovered={isHovered} setIsHovered={setIsHovered} />
      </div>
      
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isHovered ? 'ml-56' : 'ml-16'}`}>
        <Header isHovered={isHovered}/>
        <div className="flex-1 p-4 flex flex-col justify-center items-center">
          <Greeting />
          <div className="w-[55vw]">
            <TextBox onSubmit={handlePromptSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
