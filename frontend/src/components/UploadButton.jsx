import { useState } from 'react';

function UploadButton() {
    const [isClicked, setIsClicked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const uploads = [
        {type: 'image', icon: '🖼️'},
        {type: 'file', icon: '📄'},
    ]
    return (
    <button 
      className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-white hover:bg-gray-600 transition-colors" 
      onClick={() => setIsClicked(!isClicked)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
    {isClicked && (
        <div className="absolute mt-2 bg-gray-800 rounded shadow-lg p-2 flex flex-col gap-2">
          {uploads.map(upload => (
            <button key={upload.type} className="flex items-center gap-2 hover:bg-gray-700 rounded px-2 py-1 transition-colors">
              {upload.icon} Upload {upload.type}
            </button>
          ))}
        </div>
      )}
      <span className={`inline-block transition-transform duration-300 ${isHovered ? 'rotate-90' : ''}`}>
        +
      </span>
      
    </button>
  )
}

export default UploadButton