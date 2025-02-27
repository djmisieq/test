import React, { useState } from 'react';

// Komponent widoku szablonów
function TemplatesView({
  templates, 
  loadTemplate, 
  deleteTemplate, 
  darkMode
}) {
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  
  const toggleExpandTemplate = (templateId) => {
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null);
    } else {
      setExpandedTemplate(templateId);
    }
  };

  return (
    <div className={`${darkMode ? 'dark:bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6`}>
      <h2 className="text-xl font-bold mb-6">Twoje szablony</h2>
      
      {templates.length === 0 ? (
        <div className={`text-center py-8 border-2 border-dashed rounded-lg ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
          <p className="text-lg">Nie masz jeszcze żadnych szablonów</p>
          <p className="mt-2">Zapisz swoją listę zakupów jako szablon, aby móc ją łatwo odtworzyć w przyszłości</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <div 
              key={template.id} 
              className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                <p className="text-sm opacity-70">{template.items.length} produktów</p>
              </div>
              
              <div className="p-4">
                <div 
                  className={`mb-3 ${expandedTemplate === template.id ? '' : 'line-clamp-2 overflow-hidden'}`}
                >
                  <p className="text-sm">
                    {template.items.map(item => item.name).join(', ')}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleExpandTemplate(template.id)}
                    className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    {expandedTemplate === template.id ? 'Pokaż mniej' : 'Pokaż więcej'}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => loadTemplate(template.id)}
                      className={`px-3 py-1 rounded text-sm ${darkMode ? 'bg-teal-700 hover:bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'} text-white`}
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
                </div>
              </div>
              
              {expandedTemplate === template.id && (
                <div className={`p-4 ${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t'}`}>
                  <h4 className="font-medium mb-2 text-sm">Szczegóły szablonu:</h4>
                  <ul className="space-y-1">
                    {template.items.map(item => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="opacity-60">{item.category}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplatesView;