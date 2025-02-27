import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  // Ładowanie listy zakupów z localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('shoppingList');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Zapis listy zakupów do localStorage
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, { 
        id: Date.now(), 
        name: newItem, 
        completed: false 
      }]);
      setNewItem('');
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Lista Zakupów</h1>
      
      <div className="flex mb-4">
        <input 
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Dodaj produkt"
          className="flex-grow p-2 border rounded-l-lg"
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
        />
        <button 
          onClick={addItem}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          Dodaj
        </button>
      </div>

      <ul>
        {items.map(item => (
          <li 
            key={item.id} 
            className="flex items-center justify-between p-2 border-b"
          >
            <div className="flex items-center">
              <input 
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItemCompletion(item.id)}
                className="mr-2"
              />
              <span className={item.completed ? 'line-through text-gray-400' : ''}>
                {item.name}
              </span>
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;