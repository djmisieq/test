import React, { useState } from 'react';

function PriceEditor({ 
  itemId, 
  price, 
  quantity, 
  updateItemPrice,
  darkMode 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editPrice, setEditPrice] = useState(price || 0);
  const [editQuantity, setEditQuantity] = useState(quantity || 1);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setEditPrice(price || 0);
      setEditQuantity(quantity || 1);
    }
  };
  
  const handleSave = () => {
    const newPrice = parseFloat(editPrice);
    const newQuantity = parseFloat(editQuantity);
    
    if (isNaN(newPrice) || newPrice < 0) {
      alert('Podaj prawidłową cenę');
      return;
    }
    
    if (isNaN(newQuantity) || newQuantity <= 0) {
      alert('Podaj prawidłową ilość (minimum 1)');
      return;
    }
    
    updateItemPrice(itemId, newPrice, newQuantity);
    setIsOpen(false);
  };
  
  // Formatowanie ceny do wyświetlenia
  const formatCurrency = (amount) => {
    return amount.toLocaleString('pl-PL', { 
      style: 'currency', 
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Obliczenie całkowitej wartości
  const total = (price || 0) * (quantity || 1);
  
  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className={`flex items-center justify-center p-1 rounded-full ${
          price ? (
            darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
          ) : (
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          )
        }`}
        title="Edytuj cenę"
      >
        <span>{price ? formatCurrency(total) : '💰'}</span>
        {quantity > 1 && (
          <span className="ml-1 text-xs">×{quantity}</span>
        )}
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 mt-1 z-10 w-64 rounded-md shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h5 className="text-sm font-medium">Cena produktu</h5>
              <button
                onClick={toggleOpen}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                ✖
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Cena jednostkowa</label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className={`flex-grow p-2 border rounded-l ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
                    }`}
                  />
                  <div className={`px-2 flex items-center ${
                    darkMode ? 'bg-gray-600 border border-gray-600' : 'bg-gray-100 border border-gray-300'
                  } rounded-r`}>
                    PLN
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Ilość</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className={`w-full p-2 border rounded ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
                  }`}
                />
              </div>
              
              <div className={`p-2 rounded ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex justify-between">
                  <span className="text-sm">Razem:</span>
                  <span className="font-bold">
                    {formatCurrency(parseFloat(editPrice || 0) * parseFloat(editQuantity || 1))}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className={`px-3 py-1 rounded ${
                    darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceEditor;