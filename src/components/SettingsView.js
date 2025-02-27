import React from 'react';

// Komponent widoku ustawień
function SettingsView({ darkMode, toggleDarkMode }) {
  return (
    <div className={`${darkMode ? 'dark:bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6`}>
      <h2 className="text-xl font-bold mb-6">Ustawienia aplikacji</h2>
      
      <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Tryb ciemny</h3>
            <p className="text-sm opacity-70 mt-1">Przełącz między jasnym i ciemnym interfejsem</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${darkMode ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
          >
            <div className={`w-5 h-5 rounded-full transform transition-transform ${darkMode ? 'bg-white translate-x-0' : 'bg-white translate-x-0'}`}>
              {darkMode ? '🌙' : '☀️'}
            </div>
          </button>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h3 className="font-semibold text-lg mb-2">O aplikacji</h3>
        <p className="text-sm">Lista Zakupów v1.0</p>
        <p className="text-sm mt-1 opacity-70">Aplikacja do zarządzania listami zakupów, szablonami i kategoriami.</p>
      </div>
    </div>
  );
}

export default SettingsView;