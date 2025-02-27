import React, { useState, useEffect } from 'react';

// Domyślne kategorie
const DEFAULT_CATEGORIES = [
  'Warzywa i Owoce', 
  'Pieczywo', 
  'Chemia', 
  'Mięso i Wędliny', 
  'Nabiał', 
  'Sypkie', 
  'Inne'
];

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [darkMode, setDarkMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [filterCategory, setFilterCategory] = useState('Wszystkie');

  // Ładowanie listy zakupów z localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('shoppingList');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Zapis listy zakupów i trybu ciemnego do localStorage
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [items, darkMode]);

  const addItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, { 
        id: Date.now(), 
        name: newItem, 
        category: newItemCategory,
        completed: false 
      }]);
      setNewItem('');
      setNewItemCategory(DEFAULT_CATEGORIES[0]);
    }
  };

  const toggleItemCompletion = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const startEditItem = (item) => {
    setEditingItem(item.id);
    setEditItemName(item.name);
  };

  const saveEditItem = () => {
    if (editItemName.trim() !== '') {
      setItems(items.map(item => 
        item.id === editingItem 
          ? { ...item, name: editItemName.trim() } 
          : item
      ));
      setEditingItem(null);
      setEditItemName('');
    }
  };

  const cancelEditItem = () => {
    setEditingItem(null);
    setEditItemName('');
  };

  // Filtrowanie produktów
  const filteredItems = filterCategory === 'Wszystkie' 
    ? items 
    : items.filter(item => item.category === filterCategory);

  // Grupowanie produktów według kategorii
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className={`${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-md mx-auto pt-10 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Lista Zakupów</h1>
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      
        {/* Dodawanie produktu z kategorią */}
        <div className="mb-4">
          <div className="flex mb-2">
            <input 
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Dodaj produkt"
              className={`flex-grow p-2 border rounded-l-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
            <button 
              onClick={addItem}
              className={`${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white p-2 rounded-r-lg transition-colors`}
            >
              Dodaj
            </button>
          </div>
          
          {/* Wybór kategorii */}
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
          >
            {DEFAULT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Filtrowanie kategorii */}
        <div className="mb-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
          >
            <option value="Wszystkie">Wszystkie kategorie</option>
            {DEFAULT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Lista produktów pogrupowanych po kategoriach */}
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="mb-4">
            <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {category}
            </h2>
            <ul>
              {categoryItems.map(item => (
                <li 
                  key={item.id} 
                  className={`flex items-center justify-between p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  {editingItem === item.id ? (
                    <div className="flex w-full">
                      <input 
                        type="text"
                        value={editItemName}
                        onChange={(e) => setEditItemName(e.target.value)}
                        className={`flex-grow p-1 border rounded-l ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveEditItem();
                          if (e.key === 'Escape') cancelEditItem();
                        }}
                        autoFocus
                      />
                      <div>
                        <button 
                          onClick={saveEditItem}
                          className={`p-1 ml-1 ${darkMode ? 'bg-green-700 text-white' : 'bg-green-500 text-white'} rounded`}
                        >
                          ✓
                        </button>
                        <button 
                          onClick={cancelEditItem}
                          className={`p-1 ml-1 ${darkMode ? 'bg-red-700 text-white' : 'bg-red-500 text-white'} rounded`}
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center w-full">
                      <input 
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItemCompletion(item.id)}
                        className={`mr-2 ${darkMode ? 'bg-gray-800 text-blue-500' : ''}`}
                      />
                      <span 
                        onDoubleClick={() => startEditItem(item)}
                        className={`flex-grow ${item.completed ? 'line-through text-gray-400' : ''}`}
                      >
                        {item.name}
                      </span>
                      <div className="flex items-center">
                        <button 
                          onClick={() => startEditItem(item)}
                          className={`mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'} transition-colors`}
                        >
                          ✎
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} transition-colors`}
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;