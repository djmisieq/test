import React, { useState } from 'react';

function Settings({ isOpen, onClose, darkMode, toggleDarkMode, templates, loadTemplate, deleteTemplate }) {
  const [activeTab, setActiveTab] = useState('general');
  const [expandedTemplate, setExpandedTemplate] = useState(null);

  if (!isOpen) return null;

  const handleLoadTemplate = (templateId) => {
    loadTemplate(templateId);
    onClose();
  };

  const toggleExpandTemplate = (templateId) => {
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null);
    } else {
      setExpandedTemplate(templateId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ustawienia</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            ✖
          </button>
        </div>
        
        {/* Zakładki */}
        <div className="flex border-b mb-4">
          <button 
            onClick={() => setActiveTab('general')}
            className={`py-2 px-4 ${activeTab === 'general' 
              ? darkMode 
                ? 'border-b-2 border-blue-500 text-blue-400' 
                : 'border-b-2 border-blue-500 text-blue-600' 
              : ''}`}
          >
            Ogólne
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-4 ${activeTab === 'templates' 
              ? darkMode 
                ? 'border-b-2 border-blue-500 text-blue-400' 
                : 'border-b-2 border-blue-500 text-blue-600' 
              : ''}`}
          >
            Szablony
          </button>
        </div>
        
        {/* Zawartość zakładki Ogólne */}
        {activeTab === 'general' && (
          <div>
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
          </div>
        )}
        
        {/* Zawartość zakładki Szablony */}
        {activeTab === 'templates' && (
          <div>
            {templates.length === 0 ? (
              <div className="text-center py-4">
                <p>Nie masz jeszcze zapisanych szablonów.</p>
                <p className="text-sm mt-1 opacity-80">
                  Dodaj produkty do listy i kliknij "Zapisz jako szablon" na głównym ekranie.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-medium mb-2">Zapisane szablony</h3>
                <ul className="space-y-2">
                  {templates.map(template => (
                    <li 
                      key={template.id} 
                      className={`border rounded-lg p-3 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{template.name}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleExpandTemplate(template.id)}
                            className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                          >
                            {expandedTemplate === template.id ? 'Zwiń' : `Pokaż (${template.items.length})`}
                          </button>
                        </div>
                      </div>
                      
                      {expandedTemplate === template.id && (
                        <div className="mt-2 pl-2 border-l-2 border-gray-500">
                          <ul className="space-y-1 text-sm">
                            {template.items.map(item => (
                              <li key={item.id} className="flex justify-between">
                                <span>{item.name}</span>
                                <span className="text-xs opacity-70">{item.category}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleLoadTemplate(template.id)}
                          className={`px-3 py-1 mr-2 rounded text-sm ${darkMode ? 'bg-teal-700 hover:bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'} text-white`}
                        >
                          Wczytaj
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className={`px-3 py-1 rounded text-sm ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                        >
                          Usuń
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
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