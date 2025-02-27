import React from 'react';

// Komponent głównego układu aplikacji
function Layout({ 
  children, 
  darkMode, 
  sidebarOpen, 
  toggleSidebar, 
  activeView, 
  setActiveView, 
  toggleDarkMode, 
  itemsCount, 
  templatesCount, 
  categoriesCount, 
  storesCount, 
  storesToVisitCount,
  showBudget,
  budgetAmount,
  remainingBudget
}) {
  // Formatowanie kwoty do wyświetlenia
  const formatCurrency = (amount) => {
    return amount.toLocaleString('pl-PL', { 
      style: 'currency', 
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
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
                onClick={() => setActiveView('stores')}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === 'stores' 
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800') 
                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                }`}
              >
                <span className="mr-3">🏪</span>
                <span className="flex-grow">Sklepy</span>
                <div className="flex">
                  <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-blue-600' : 'bg-blue-200'}`}>{storesCount || 0}</span>
                  {storesToVisitCount > 0 && (
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-green-600' : 'bg-green-200'}`} title="Do odwiedzenia">
                      {storesToVisitCount}
                    </span>
                  )}
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveView('budget')}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === 'budget' 
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800') 
                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                }`}
              >
                <span className="mr-3">💰</span>
                <span className="flex-grow">Budżet</span>
                {showBudget && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    remainingBudget < 0 
                      ? (darkMode ? 'bg-red-600' : 'bg-red-200') 
                      : (darkMode ? 'bg-green-600' : 'bg-green-200')
                  }`} title="Pozostało">
                    {formatCurrency(remainingBudget)}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveView('menu-planner')}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === 'menu-planner' 
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800') 
                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                }`}
              >
                <span className="mr-3">🍽️</span>
                <span className="flex-grow">Planer Menu</span>
                <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-purple-600' : 'bg-purple-200'}`}>Nowe</span>
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
            {activeView === 'stores' && 'Sklepy'}
            {activeView === 'budget' && 'Budżet'}
            {activeView === 'menu-planner' && 'Planer Menu'}
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

export default Layout;