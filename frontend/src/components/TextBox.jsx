import React, { useState } from 'react'
<<<<<<< HEAD

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
=======
import UploadButton from './UploadButton'

function TextBox({ onSubmit }) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit?.(value.trim());
>>>>>>> a0f182024c81e06bb9447a3a8b4fa4875d94b9c7
    }
  };

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit} className="text-box flex justify-center items-center gap-2 w-full">
        <div className="relative flex items-center w-full">
=======
    <div className="text-box flex justify-center items-center gap-2 w-full">
        <div className="relative w-full">
>>>>>>> a0f182024c81e06bb9447a3a8b4fa4875d94b9c7
          <input 
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter text here..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-full text-white focus:outline-none pl-14" 
          />
<<<<<<< HEAD
          <button 
            type="button"
            className="absolute left-2 bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
          >
            +
          </button>
=======
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <UploadButton />
          </div>
>>>>>>> a0f182024c81e06bb9447a3a8b4fa4875d94b9c7
        </div>
    </form>
  )
}

export default TextBox