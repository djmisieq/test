import React, { useState } from 'react';

// Komponent wyboru sklepu dla produktu
function StoreSelector({ 
  itemId, 
  stores, 
  selectedStores,
  updateItemStores,
  darkMode 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleStore = (storeId) => {
    const currentSelectedStores = selectedStores || [];
    let newSelectedStores;
    
    if (currentSelectedStores.includes(storeId)) {
      // Usuwamy sklep z listy
      newSelectedStores = currentSelectedStores.filter(id => id !== storeId);
    } else {
      // Dodajemy sklep do listy
      newSelectedStores = [...currentSelectedStores, storeId];
    }
    
    updateItemStores(itemId, newSelectedStores);
  };
  
  // Obliczamy liczbę wybranych sklepów
  const selectedCount = selectedStores ? selectedStores.length : 0;
  
  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className={`flex items-center justify-center p-1 rounded-full ${
          darkMode 
            ? (selectedCount > 0 ? 'bg-blue-600 text-white' : 'hover:bg-gray-700') 
            : (selectedCount > 0 ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200')
        }`}
        title="Wybierz sklepy"
      >
        <span>🏪</span>
        {selectedCount > 0 && (
          <span className="ml-1 text-xs font-semibold">{selectedCount}</span>
        )}
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 mt-1 z-10 w-60 rounded-md shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="py-1 px-2">
            <div className="flex justify-between items-center p-2">
              <h5 className="text-sm font-medium">Dostępne w sklepach</h5>
              <button
                onClick={toggleOpen}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                ✖
              </button>
            </div>
            
            {stores.length === 0 ? (
              <div className="p-2 text-sm text-center">
                <p>Brak dostępnych sklepów</p>
                <a 
                  href="#" 
                  className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleOpen();
                    // Tutaj można dodać przekierowanie do widoku sklepów
                  }}
                >
                  Dodaj sklep w panelu Sklepy
                </a>
              </div>
            ) : (
              <ul className="max-h-48 overflow-y-auto">
                {stores.map((store) => (
                  <li key={store.id} className="px-1">
                    <button
                      onClick={() => toggleStore(store.id)}
                      className={`flex items-center w-full p-2 text-sm rounded ${
                        selectedStores && selectedStores.includes(store.id)
                          ? (darkMode ? 'bg-blue-700' : 'bg-blue-100')
                          : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                      }`}
                    >
                      <span className="mr-2">
                        {selectedStores && selectedStores.includes(store.id) ? '✓' : '○'}
                      </span>
                      <span className="flex-grow text-left">{store.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StoreSelector;