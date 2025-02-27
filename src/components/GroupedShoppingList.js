import React from 'react';

const GroupedShoppingList = ({ items, stores, toggleComplete, deleteItem, startEditing, updateItemStores }) => {
  // Grupowanie przedmiotów według sklepów
  const groupItemsByStore = () => {
    // Grupowanie przedmiotów, które nie są przypisane do żadnego sklepu
    const unassigned = items.filter(item => !item.stores || item.stores.length === 0);
    
    // Grupowanie przedmiotów według sklepów
    const groupedByStore = {};
    stores.forEach(store => {
      groupedByStore[store.id] = items.filter(
        item => item.stores && item.stores.includes(store.id)
      );
    });
    
    return { unassigned, groupedByStore };
  };

  const { unassigned, groupedByStore } = groupItemsByStore();

  return (
    <div className="space-y-6">
      {/* Przedmioty przypisane do sklepów */}
      {stores.map(store => {
        const storeItems = groupedByStore[store.id];
        
        if (!storeItems || storeItems.length === 0) return null;
        
        return (
          <div 
            key={store.id} 
            className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm"
          >
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: store.color || '#4f46e5' }}></span>
              {store.name}
            </h3>
            
            <ul className="divide-y dark:divide-gray-700">
              {storeItems.map(item => (
                <li key={item.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleComplete(item.id)}
                      className="mr-3 h-5 w-5 text-blue-600 rounded"
                    />
                    <span 
                      className={`${item.completed ? 'line-through text-gray-400' : ''}`}
                      onDoubleClick={() => startEditing(item.id)}
                    >
                      {item.name} {item.category && <span className="text-xs text-gray-500 ml-1">({item.category})</span>}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditing(item.id)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      
      {/* Przedmioty nieprzypisane do żadnego sklepu */}
      {unassigned.length > 0 && (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-medium mb-3">Nieprzypisane</h3>
          
          <ul className="divide-y dark:divide-gray-700">
            {unassigned.map(item => (
              <li key={item.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleComplete(item.id)}
                    className="mr-3 h-5 w-5 text-blue-600 rounded"
                  />
                  <span 
                    className={`${item.completed ? 'line-through text-gray-400' : ''}`}
                    onDoubleClick={() => startEditing(item.id)}
                  >
                    {item.name} {item.category && <span className="text-xs text-gray-500 ml-1">({item.category})</span>}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditing(item.id)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GroupedShoppingList;
