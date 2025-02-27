import React, { useState } from 'react';

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

export default CategoriesView;