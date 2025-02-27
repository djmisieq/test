import React from 'react';

const RecipesView = ({ recipes, deleteRecipe, categories, darkMode }) => {
  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Moje Przepisy</h2>
        <button
          onClick={() => alert('Funkcja dodawania nowego przepisu')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj nowy przepis
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className={`p-8 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-lg">Brak przepisów. Dodaj swój pierwszy przepis!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
            >
              {recipe.imageUrl ? (
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${recipe.imageUrl})` }}
                />
              ) : (
                <div className={`h-48 flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <span className="text-gray-500">Brak zdjęcia</span>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                  <span className={`text-sm px-2 py-1 rounded ${darkMode ? 'bg-gray-600' : 'bg-blue-100 text-blue-800'}`}>
                    {recipe.category}
                  </span>
                </div>
                
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {recipe.description && recipe.description.length > 100 
                    ? `${recipe.description.substring(0, 100)}...` 
                    : recipe.description || 'Brak opisu'}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Czas: {recipe.prepTimeMinutes || '?'} min
                  </span>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert(`Zobacz przepis ${recipe.name}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Zobacz
                    </button>
                    <button 
                      onClick={() => alert(`Edytuj przepis ${recipe.name}`)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Czy na pewno chcesz usunąć ten przepis?')) {
                          deleteRecipe(recipe.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesView;