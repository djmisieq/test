import React from 'react';

function Settings({ isOpen, onClose, darkMode, toggleDarkMode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg max-w-md w-full`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ustawienia</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            ✖
          </button>
        </div>
        
        <div className="border-t border-b py-4 my-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Tryb ciemny</span>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'} transition-colors`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;