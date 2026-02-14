import { useState } from 'react';

function UploadButton() {
    const [isClicked, setIsClicked] = useState(false);
    return (
    <button className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-white hover:bg-gray-600 transition-colors" onClick={() => setIsClicked(!isClicked)}>
      +
    </button>
  )
}

export default UploadButton