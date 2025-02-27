import React, { useState } from 'react';

// Komponent dedykowany dla widoku listy zakupów
function ShoppingListView({ 
  items, setItems, 
  categories, 
  newItem, setNewItem, 
  newItemCategory, setNewItemCategory, 
  editingItem, setEditingItem, 
  editItemName, setEditItemName, 
  filterCategory, setFilterCategory,
  saveTemplateModalOpen, setSaveTemplateModalOpen,
  newTemplateName, setNewTemplateName,
  saveAsTemplate,
  templates, loadTemplate,
  darkMode
}) {
  // Stan do śledzenia zwijania/rozwijania kategorii
  const [collapsedCategories, setCollapsedCategories] = useState({});
  
  const toggleCategoryCollapse = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const addItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, { 
        id: Date.now(), 
        name: newItem, 
        category: newItemCategory || (categories.length > 0 ? categories[0] : 'Inne'),
        completed: false 
      }]);
      setNewItem('');
      if (categories.length > 0) {
        setNewItemCategory(categories[0]);
      }
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

  const openSaveTemplateModal = () => {
    setNewTemplateName('');
    setSaveTemplateModalOpen(true);
  };

  const closeSaveTemplateModal = () => {
    setSaveTemplateModalOpen(false);
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
    <div className={`${darkMode ? 'dark:bg-gray-900' : 'bg-white'} rounded-lg shadow-md`}>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Dodaj produkt</h2>
          <div className="flex flex-col md:flex-row mb-2 gap-2">
            <div className="flex flex-1">
              <input 
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Nazwa produktu"
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
            
            {categories.length > 0 && (
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className={`p-2 border rounded-lg md:w-1/3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={openSaveTemplateModal}
            className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-500 hover:bg-purple-600'} text-white transition-colors`}
          >
            💾 Zapisz jako szablon
          </button>
          
          {templates.length > 0 && (
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    loadTemplate(parseInt(e.target.value));
                    e.target.value = ''; // Reset po wyborze
                  }
                }}
                className={`px-3 py-2 rounded-lg appearance-none pr-8 ${darkMode ? 'bg-teal-700 text-white border-gray-700' : 'bg-teal-500 text-white'} transition-colors`}
              >
                <option value="">📋 Wczytaj szablon</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          )}

          <div className="relative ml-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-3 py-2 rounded-lg appearance-none pr-8 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            >
              <option value="Wszystkie">🔍 Wszystkie kategorie</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Twoje produkty</h2>
          
          {Object.keys(groupedItems).length === 0 ? (
            <div className={`text-center py-8 border-2 border-dashed rounded-lg ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
              <p className="text-lg">Twoja lista zakupów jest pusta</p>
              <p className="mt-2">Dodaj produkty używając formularza powyżej</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedItems).map(([category, categoryItems]) => {
                const isCollapsed = collapsedCategories[category];
                const completedCount = categoryItems.filter(item => item.completed).length;
                const totalCount = categoryItems.length;
                const progressPercent = (completedCount / totalCount) * 100;
                
                return (
                  <div key={category} className={`border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div 
                      className={`p-3 flex items-center justify-between cursor-pointer ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-t-lg`}
                      onClick={() => toggleCategoryCollapse(category)}
                    >
                      <div className="flex items-center">
                        <span className={`mr-2 transform transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}>▶</span>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {category}
                        </h3>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{completedCount}/{totalCount}</span>
                        <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {!isCollapsed && (
                      <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {categoryItems.map(item => (
                          <li 
                            key={item.id} 
                            className={`p-3 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                          >
                            {editingItem === item.id ? (
                              <div className="flex w-full">
                                <input 
                                  type="text"
                                  value={editItemName}
                                  onChange={(e) => setEditItemName(e.target.value)}
                                  className={`flex-grow p-2 border rounded-l ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') saveEditItem();
                                    if (e.key === 'Escape') cancelEditItem();
                                  }}
                                  autoFocus
                                />
                                <div>
                                  <button 
                                    onClick={saveEditItem}
                                    className={`p-2 ${darkMode ? 'bg-green-700 text-white' : 'bg-green-500 text-white'}`}
                                  >
                                    ✓
                                  </button>
                                  <button 
                                    onClick={cancelEditItem}
                                    className={`p-2 ${darkMode ? 'bg-red-700 text-white' : 'bg-red-500 text-white'} rounded-r`}
                                  >
                                    ✖
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between group">
                                <div className="flex items-center">
                                  <input 
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => toggleItemCompletion(item.id)}
                                    className={`w-5 h-5 mr-3 ${darkMode ? 'bg-gray-800 text-blue-500' : ''}`}
                                  />
                                  <span 
                                    className={`${item.completed ? 'line-through text-gray-400' : ''}`}
                                  >
                                    {item.name}
                                  </span>
                                </div>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => startEditItem(item)}
                                    className={`p-1 ml-1 rounded-full ${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-500 hover:bg-gray-200'}`}
                                  >
                                    ✎
                                  </button>
                                  <button 
                                    onClick={() => removeItem(item.id)}
                                    className={`p-1 ml-1 rounded-full ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-200'}`}
                                  >
                                    ✖
                                  </button>
                                </div>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal do zapisywania szablonu */}
      {saveTemplateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg max-w-md w-full`}>
            <h2 className="text-xl font-bold mb-4">Zapisz jako szablon</h2>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Nazwa szablonu"
              className={`w-full p-2 border rounded mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
              onKeyPress={(e) => e.key === 'Enter' && saveAsTemplate()}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeSaveTemplateModal}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Anuluj
              </button>
              <button
                onClick={saveAsTemplate}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingListView;