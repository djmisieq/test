import React, { useState, useEffect } from 'react';
import Settings from './Settings';

// Domyślne kategorie jako stała (do wykorzystania przy resetowaniu)
const DEFAULT_CATEGORIES = [
  'Warzywa i Owoce', 
  'Pieczywo', 
  'Chemia', 
  'Mięso i Wędliny', 
  'Nabiał', 
  'Sypkie', 
  'Inne'
];

// Komponent głównego układu aplikacji
function Layout({ children, darkMode, sidebarOpen, toggleSidebar, activeView, setActiveView, toggleDarkMode, itemsCount, templatesCount, categoriesCount }) {
  return (
    <div className={`${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen transition-colors duration-300 flex`}>
      {/* Overlay tła przy otwartym sidebar na mobilnych urządzeniach */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:static z-30 h-full w-64 transform transition-transform duration-300 ease-in-out
        ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} shadow-lg
      `}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">Lista Zakupów</h1>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-full hover:bg-gray-700"
          >
            ✖
          </button>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveView('shopping-list')}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === 'shopping-list' 
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800') 
                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                }`}
              >
                <span className="mr-3">🛒</span>
                <span className="flex-grow">Lista Zakupów</span>
                <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-blue-600' : 'bg-blue-200'}`}>{itemsCount}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveView('templates')}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === 'templates' 
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800') 
                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                }`}
              >
                <span className="mr-3">📋</span>
                <span className="flex-grow">Szablony</span>
                <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-blue-600' : 'bg-blue-200'}`}>{templatesCount}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveView('categories')}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === 'categories' 
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800') 
                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                }`}
              >
                <span className="mr-3">🏷️</span>
                <span className="flex-grow">Kategorie</span>
                <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-blue-600' : 'bg-blue-200'}`}>{categoriesCount}</span>
              </button>
            </li>
            <li className="mt-4 pt-4 border-t border-gray-700">
              <button 
                onClick={() => setActiveView('settings')}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === 'settings' 
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800') 
                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                }`}
              >
                <span className="mr-3">⚙️</span>
                <span>Ustawienia</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button 
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-center p-2 rounded-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            {darkMode ? '☀️ Tryb jasny' : '🌙 Tryb ciemny'}
          </button>
        </div>
      </aside>
      
      {/* Główna zawartość */}
      <main className="flex-1 p-4 md:p-6 overflow-auto max-h-screen">
        {/* Górny pasek (tylko mobilny) */}
        <div className="md:hidden flex justify-between items-center mb-4 sticky top-0 z-10 py-2 px-1 bg-inherit">
          <button 
            onClick={toggleSidebar}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            ☰
          </button>
          
          <h1 className="text-lg font-bold ml-2">
            {activeView === 'shopping-list' && 'Lista Zakupów'}
            {activeView === 'templates' && 'Szablony'}
            {activeView === 'categories' && 'Kategorie'}
            {activeView === 'settings' && 'Ustawienia'}
          </h1>
          
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        <div className="mt-2 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

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

// Komponent widoku kategorii
function CategoriesView({
  categories,
  addCategory,
  editCategory,
  deleteCategory,
  resetCategories,
  darkMode
}) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    
    addCategory(newCategory);
    setNewCategory('');
  };

  const startEditCategory = (category) => {
    setEditingCategory(category);
    setEditedCategoryName(category);
  };

  const handleEditCategory = () => {
    if (editedCategoryName.trim() === '' || editedCategoryName === editingCategory) {
      cancelEditCategory();
      return;
    }
    
    editCategory(editingCategory, editedCategoryName);
    cancelEditCategory();
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditedCategoryName('');
  };

  const handleDeleteCategory = (category) => {
    // Potwierdź przed usunięciem
    if (categories.length <= 1) {
      alert('Nie można usunąć ostatniej kategorii.');
      return;
    }
    
    if (window.confirm(`Czy na pewno chcesz usunąć kategorię "${category}"?\nWszystkie produkty z tej kategorii zostaną przeniesione do innej kategorii.`)) {
      deleteCategory(category);
    }
  };

  const handleResetCategories = () => {
    if (window.confirm('Czy na pewno chcesz przywrócić domyślne kategorie? Wszystkie produkty zostaną przypisane do odpowiednich kategorii.')) {
      resetCategories();
    }
  };

  // Przypisujemy kolory do poszczególnych kategorii dla lepszej wizualizacji
  const categoryColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];

  return (
    <div className={`${darkMode ? 'dark:bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Kategorie produktów</h2>
        <button
          onClick={handleResetCategories}
          className={`px-3 py-1 text-sm rounded ${darkMode ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-yellow-500 hover:bg-yellow-400'} text-white`}
        >
          Resetuj do domyślnych
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-3">Dodaj nową kategorię</h3>
        <div className="flex">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nazwa kategorii"
            className={`flex-grow p-2 border rounded-l-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            className={`px-4 py-2 rounded-r-lg ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            Dodaj
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Zarządzaj kategoriami</h3>
        
        {categories.length === 0 ? (
          <div className={`text-center py-4 border rounded-lg ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
            <p>Brak kategorii. Dodaj pierwszą kategorię powyżej.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <div 
                key={category} 
                className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                {editingCategory === category ? (
                  <div className="p-3">
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        className={`flex-grow p-2 border rounded-l ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleEditCategory();
                          if (e.key === 'Escape') cancelEditCategory();
                        }}
                        autoFocus
                      />
                      <div className="flex">
                        <button
                          onClick={handleEditCategory}
                          className={`p-2 ${darkMode ? 'bg-green-700 text-white' : 'bg-green-500 text-white'}`}
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEditCategory}
                          className={`p-2 ${darkMode ? 'bg-red-700 text-white' : 'bg-red-500 text-white'} rounded-r`}
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                    <p className="text-sm opacity-70">Edytuj nazwę kategorii</p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className={`w-2 self-stretch ${categoryColors[index % categoryColors.length]}`}></div>
                    <div className="flex flex-grow justify-between items-center p-3">
                      <span className="font-medium">{category}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEditCategory(category)}
                          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          disabled={categories.length <= 1}
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {categories.length <= 1 && (
          <p className="text-sm mt-2 italic opacity-70">
            Musi istnieć co najmniej jedna kategoria.
          </p>
        )}
      </div>
    </div>
  );
}

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

function App() {
  // Główne stany aplikacji
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [templates, setTemplates] = useState([]);
  
  // Stany UI
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('shopping-list');
  
  // Stany formularzy i edycji
  const [newItem, setNewItem] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [filterCategory, setFilterCategory] = useState('Wszystkie');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [saveTemplateModalOpen, setSaveTemplateModalOpen] = useState(false);
  
  // Ustaw domyślną kategorię, gdy kategorie zostaną załadowane
  useEffect(() => {
    if (categories.length > 0 && !newItemCategory) {
      setNewItemCategory(categories[0]);
    }
  }, [categories, newItemCategory]);

  // Ładowanie danych z localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('shoppingList');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedTemplates = localStorage.getItem('shoppingTemplates');
    const savedCategories = localStorage.getItem('shoppingCategories');
    
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Zapis danych do localStorage
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [items, darkMode]);

  useEffect(() => {
    localStorage.setItem('shoppingTemplates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('shoppingCategories', JSON.stringify(categories));
  }, [categories]);

  // Funkcje UI
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Funkcje zarządzania szablonami
  const saveAsTemplate = () => {
    if (newTemplateName.trim() === '') return;
    
    // Filtrujemy tylko niezakończone elementy do szablonu i usuwamy pole completed
    const templateItems = items
      .filter(item => !item.completed)
      .map(({ id, name, category }) => ({
        id: Date.now() + Math.random(), // Generujemy nowe ID dla szablonu
        name,
        category
      }));
    
    const newTemplate = {
      id: Date.now(),
      name: newTemplateName.trim(),
      items: templateItems
    };
    
    setTemplates([...templates, newTemplate]);
    setSaveTemplateModalOpen(false);
  };

  const loadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    // Dodaj elementy z szablonu do bieżącej listy,
    // ale tylko te, których jeszcze nie ma na liście
    const existingNames = new Set(items.map(item => item.name.toLowerCase()));
    
    const newItems = template.items
      .filter(item => !existingNames.has(item.name.toLowerCase()))
      .map(item => ({
        ...item,
        id: Date.now() + Math.random(), // Generujemy nowe unikalne ID
        completed: false
      }));
    
    if (newItems.length > 0) {
      setItems([...items, ...newItems]);
    }
  };

  const deleteTemplate = (templateId) => {
    setTemplates(templates.filter(template => template.id !== templateId));
  };

  // Funkcje zarządzania kategoriami
  const addCategory = (categoryName) => {
    if (categoryName.trim() === '') return;
    if (categories.includes(categoryName.trim())) return;
    
    setCategories([...categories, categoryName.trim()]);
  };

  const editCategory = (oldName, newName) => {
    if (newName.trim() === '' || oldName === newName) return;
    if (categories.includes(newName.trim())) return;
    
    // Aktualizujemy listę kategorii
    setCategories(categories.map(category => 
      category === oldName ? newName.trim() : category
    ));
    
    // Aktualizujemy kategorie produktów na liście
    setItems(items.map(item => 
      item.category === oldName ? { ...item, category: newName.trim() } : item
    ));
    
    // Aktualizujemy kategorie w szablonach
    setTemplates(templates.map(template => ({
      ...template,
      items: template.items.map(item => 
        item.category === oldName ? { ...item, category: newName.trim() } : item
      )
    })));
  };

  const deleteCategory = (categoryName) => {
    // Sprawdzamy czy to nie jest ostatnia kategoria
    if (categories.length <= 1) return;
    
    // Wybieramy kategorię zastępczą (pierwsza dostępna inna niż usuwana)
    const fallbackCategory = categories.find(c => c !== categoryName) || 'Inne';
    
    // Usuwamy kategorię z listy
    setCategories(categories.filter(category => category !== categoryName));
    
    // Przenosimy produkty do kategorii zastępczej
    setItems(items.map(item => 
      item.category === categoryName ? { ...item, category: fallbackCategory } : item
    ));
    
    // Aktualizujemy kategorie w szablonach
    setTemplates(templates.map(template => ({
      ...template,
      items: template.items.map(item => 
        item.category === categoryName ? { ...item, category: fallbackCategory } : item
      )
    })));
    
    // Aktualizujemy filtr kategorii jeśli trzeba
    if (filterCategory === categoryName) {
      setFilterCategory('Wszystkie');
    }
    
    // Aktualizujemy kategorię nowego przedmiotu jeśli trzeba
    if (newItemCategory === categoryName) {
      setNewItemCategory(fallbackCategory);
    }
  };

  const resetCategories = () => {
    // Mapujemy stare kategorie do domyślnych
    const categoryMap = {};
    categories.forEach((category, index) => {
      if (index < DEFAULT_CATEGORIES.length) {
        categoryMap[category] = DEFAULT_CATEGORIES[index];
      } else {
        categoryMap[category] = DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]; // Mapujemy nadmiarowe do "Inne"
      }
    });
    
    // Aktualizujemy kategorie produktów
    setItems(items.map(item => ({
      ...item,
      category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
    })));
    
    // Aktualizujemy kategorie w szablonach
    setTemplates(templates.map(template => ({
      ...template,
      items: template.items.map(item => ({
        ...item,
        category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
      }))
    })));
    
    // Przywracamy domyślne kategorie
    setCategories([...DEFAULT_CATEGORIES]);
    
    // Aktualizujemy filtr i kategorię nowego przedmiotu
    setFilterCategory('Wszystkie');
    setNewItemCategory(DEFAULT_CATEGORIES[0]);
  };

  // Renderowanie odpowiedniego widoku
  const renderActiveView = () => {
    switch(activeView) {
      case 'shopping-list':
        return (
          <ShoppingListView
            items={items}
            setItems={setItems}
            categories={categories}
            newItem={newItem}
            setNewItem={setNewItem}
            newItemCategory={newItemCategory}
            setNewItemCategory={setNewItemCategory}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            editItemName={editItemName}
            setEditItemName={setEditItemName}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            saveTemplateModalOpen={saveTemplateModalOpen}
            setSaveTemplateModalOpen={setSaveTemplateModalOpen}
            newTemplateName={newTemplateName}
            setNewTemplateName={setNewTemplateName}
            saveAsTemplate={saveAsTemplate}
            templates={templates}
            loadTemplate={loadTemplate}
            darkMode={darkMode}
          />
        );
      case 'templates':
        return (
          <TemplatesView
            templates={templates}
            loadTemplate={loadTemplate}
            deleteTemplate={deleteTemplate}
            darkMode={darkMode}
          />
        );
      case 'categories':
        return (
          <CategoriesView
            categories={categories}
            addCategory={addCategory}
            editCategory={editCategory}
            deleteCategory={deleteCategory}
            resetCategories={resetCategories}
            darkMode={darkMode}
          />
        );
      case 'settings':
        return (
          <SettingsView
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      darkMode={darkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      activeView={activeView}
      setActiveView={setActiveView}
      toggleDarkMode={toggleDarkMode}
      itemsCount={items.length}
      templatesCount={templates.length}
      categoriesCount={categories.length}
    >
      {renderActiveView()}
    </Layout>
  );
}

export default App;