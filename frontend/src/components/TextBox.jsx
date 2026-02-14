import React, { useState } from 'react'

function TextBox({ onSubmit }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && onSubmit) {
      onSubmit(prompt);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-box flex justify-center items-center gap-2 w-full">
        <div className="relative flex items-center w-full">
          <input 
            type="text"
            placeholder="Enter text here..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-full text-white focus:outline-none pl-14" 
          />
          <button 
            type="button"
            className="absolute left-2 bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
    </form>
  )
}

export default TextBox