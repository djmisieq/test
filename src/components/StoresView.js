import React, { useState } from 'react';

// Komponent widoku zarządzania sklepami
function StoresView({
  stores,
  addStore,
  editStore,
  deleteStore,
  darkMode,
  setStoreToVisit,
  calculateOptimalRoute
}) {
  const [newStore, setNewStore] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [editingStore, setEditingStore] = useState(null);
  const [editedStoreName, setEditedStoreName] = useState('');
  const [editedStoreAddress, setEditedStoreAddress] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [storesToVisit, setStoresToVisit] = useState([]);

  // Funkcja dodająca nowy sklep
  const handleAddStore = () => {
    if (newStore.trim() === '') return;
    
    addStore({
      id: Date.now(),
      name: newStore.trim(),
      address: newStoreAddress.trim(),
      visited: false
    });
    
    setNewStore('');
    setNewStoreAddress('');
  };

  // Funkcja rozpoczynająca edycję sklepu
  const startEditStore = (store) => {
    setEditingStore(store.id);
    setEditedStoreName(store.name);
    setEditedStoreAddress(store.address || '');
  };

  // Funkcja zapisująca zmiany w sklepie
  const handleEditStore = () => {
    if (editedStoreName.trim() === '') {
      cancelEditStore();
      return;
    }
    
    editStore(editingStore, {
      name: editedStoreName.trim(),
      address: editedStoreAddress.trim()
    });
    
    cancelEditStore();
  };

  // Funkcja anulująca edycję sklepu
  const cancelEditStore = () => {
    setEditingStore(null);
    setEditedStoreName('');
    setEditedStoreAddress('');
  };

  // Funkcja usuwająca sklep
  const handleDeleteStore = (storeId) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten sklep?')) {
      deleteStore(storeId);
    }
  };

  // Funkcja przełączająca stan "do odwiedzenia" sklepu
  const toggleStoreToVisit = (storeId) => {
    const isStoreSelected = storesToVisit.includes(storeId);
    
    if (isStoreSelected) {
      setStoresToVisit(storesToVisit.filter(id => id !== storeId));
    } else {
      setStoresToVisit([...storesToVisit, storeId]);
    }

    // Aktualizujemy globalny stan sklepów do odwiedzenia
    setStoreToVisit(storeId, !isStoreSelected);
  };

  // Funkcja obliczająca optymalną trasę
  const handleCalculateRoute = () => {
    if (storesToVisit.length < 2) {
      alert('Wybierz co najmniej 2 sklepy, aby obliczyć optymalną trasę.');
      return;
    }
    
    calculateOptimalRoute(storesToVisit);
    setShowMap(true);
  };

  return (
    <div className={`${darkMode ? 'dark:bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sklepy</h2>
        {storesToVisit.length > 0 && (
          <button
            onClick={handleCalculateRoute}
            className={`px-3 py-1 text-sm rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-400'} text-white`}
          >
            🗺️ Oblicz trasę ({storesToVisit.length})
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-3">Dodaj nowy sklep</h3>
        <div className="flex flex-col md:flex-row gap-2 mb-2">
          <input
            type="text"
            value={newStore}
            onChange={(e) => setNewStore(e.target.value)}
            placeholder="Nazwa sklepu"
            className={`flex-grow p-2 border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddStore()}
          />
          <input
            type="text"
            value={newStoreAddress}
            onChange={(e) => setNewStoreAddress(e.target.value)}
            placeholder="Adres (opcjonalnie)"
            className={`flex-grow p-2 border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddStore()}
          />
          <button
            onClick={handleAddStore}
            className={`px-4 py-2 rounded-lg md:w-auto w-full ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            Dodaj
          </button>
        </div>
        <p className="text-sm mt-1 opacity-70">
          Dodaj sklepy, w których robisz zakupy. Możesz później przypisać produkty do konkretnych sklepów.
        </p>
      </div>

      <div>
        <h3 className="font-medium mb-3">Twoje sklepy</h3>
        
        {stores.length === 0 ? (
          <div className={`text-center py-8 border-2 border-dashed rounded-lg ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
            <p className="text-lg">Nie masz jeszcze żadnych sklepów</p>
            <p className="mt-2">Dodaj swoje ulubione sklepy, aby efektywniej organizować zakupy</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map(store => (
              <div 
                key={store.id} 
                className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                {editingStore === store.id ? (
                  <div className="p-4">
                    <div className="mb-2">
                      <input
                        type="text"
                        value={editedStoreName}
                        onChange={(e) => setEditedStoreName(e.target.value)}
                        placeholder="Nazwa sklepu"
                        className={`w-full p-2 mb-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editedStoreAddress}
                        onChange={(e) => setEditedStoreAddress(e.target.value)}
                        placeholder="Adres sklepu"
                        className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditStore}
                        className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        Anuluj
                      </button>
                      <button
                        onClick={handleEditStore}
                        className={`px-3 py-1 rounded ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                      >
                        Zapisz
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} flex justify-between items-center`}>
                      <div>
                        <h4 className="font-medium">{store.name}</h4>
                        {store.address && (
                          <p className="text-sm opacity-70 mt-1">{store.address}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleStoreToVisit(store.id)}
                          className={`p-2 rounded-full ${storesToVisit.includes(store.id) ? 
                            (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') : 
                            (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')}`}
                          title={storesToVisit.includes(store.id) ? "Usuń z listy do odwiedzenia" : "Dodaj do listy do odwiedzenia"}
                        >
                          {storesToVisit.includes(store.id) ? '✓' : '🛒'}
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address || store.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                          title="Pokaż na mapie"
                        >
                          🗺️
                        </a>
                      </div>
                    </div>
                    <div className="p-3 flex justify-end space-x-2">
                      <button
                        onClick={() => startEditStore(store)}
                        className={`px-3 py-1 rounded text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store.id)}
                        className={`px-3 py-1 rounded text-sm ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sekcja mapy (widoczna po kliknięciu "Oblicz trasę") */}
      {showMap && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Twoja optymalna trasa</h3>
            <button
              onClick={() => setShowMap(false)}
              className={`px-2 py-1 rounded text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Zamknij mapę
            </button>
          </div>
          <div className={`bg-gray-200 h-64 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex items-center justify-center`}>
            <div className="text-center p-4">
              <p>W prawdziwej implementacji tutaj byłaby mapa pokazująca optymalną trasę między wybranymi sklepami.</p>
              <p className="mt-2 text-sm">
                Sklepy do odwiedzenia: {storesToVisit.map(id => stores.find(s => s.id === id)?.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoresView;