import React from 'react';

const RecipeDetail = ({ recipes = [], addItemsToShoppingList, fridgeItems = [], darkMode }) => {
  // Bardzo uproszczona wersja dla demonstracji
  const recipe = recipes[0] || {
    name: 'Przykładowy przepis',
    category: 'Inne',
    description: 'To jest przykładowy opis przepisu.',
    prepTimeMinutes: 30,
    servings: 4,
    difficulty: 'Łatwy',
    ingredients: [
      { name: 'Składnik 1', quantity: 200, unit: 'g', category: 'Inne' },
      { name: 'Składnik 2', quantity: 3, unit: 'szt.', category: 'Warzywa i Owoce' }
    ],
    steps: [
      'Przygotuj składniki.',
      'Wykonaj czynności kulinarne.',
      'Podawaj gorące.'
    ]
  };

  const addIngredientsToShoppingList = () => {
    const shoppingItems = recipe.ingredients.map(ingredient => ({
      id: Date.now() + Math.random(),
      name: ingredient.name,
      category: ingredient.category || 'Inne',
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      completed: false
    }));
    
    addItemsToShoppingList(shoppingItems);
    alert(`Dodano ${shoppingItems.length} składników do listy zakupów.`);
  };

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <h2 className="text-3xl font-bold">{recipe.name}</h2>
        
        <div className="flex space-x-3 mt-2 md:mt-0">
          <button
            onClick={addIngredientsToShoppingList}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <span className="mr-2">Dodaj składniki do zakupów</span>
          </button>
          
          <button
            onClick={() => alert('Edytuj przepis')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edytuj przepis
          </button>
          
          <button
            onClick={() => alert('Powrót do listy przepisów')}
            className={`px-4 py-2 rounded border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
          >
            Powrót
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informacje ogólne */}
        <div className="lg:col-span-2">
          <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Kategoria:</span>
                <span className="font-semibold">{recipe.category}</span>
              </div>
              
              <div className="flex items-center">
                <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Czas przygotowania:</span>
                <span className="font-semibold">{recipe.prepTimeMinutes} minut</span>
              </div>
              
              <div className="flex items-center">
                <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Porcje:</span>
                <span className="font-semibold">{recipe.servings}</span>
              </div>
              
              <div className="flex items-center">
                <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stopień trudności:</span>
                <span className="font-semibold">{recipe.difficulty}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Opis</h3>
              <p className="whitespace-pre-line">{recipe.description}</p>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="text-xl font-bold mb-4">Sposób przygotowania</h3>
            <ol className="list-decimal pl-6 space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="pl-2">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {/* Składniki */}
        <div>
          <div className={`p-6 rounded-lg sticky top-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="text-xl font-bold mb-4">Składniki</h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => {
                // Sprawdź czy składnik jest w lodówce
                const fridgeItem = fridgeItems.find(item => 
                  item.name.toLowerCase() === ingredient.name.toLowerCase() && 
                  item.unit === ingredient.unit
                );
                
                const isInFridge = fridgeItem && parseFloat(fridgeItem.quantity) >= parseFloat(ingredient.quantity);
                const isPartiallyInFridge = fridgeItem && parseFloat(fridgeItem.quantity) < parseFloat(ingredient.quantity);
                
                return (
                  <li 
                    key={index} 
                    className={`flex justify-between items-center p-2 rounded ${isInFridge ? 'bg-green-100 text-green-800' : ''} ${isPartiallyInFridge ? 'bg-yellow-100 text-yellow-800' : ''}`}
                  >
                    <span className="font-medium">{ingredient.name}</span>
                    <span>
                      {ingredient.quantity} {ingredient.unit}
                      {isInFridge && (
                        <span className="ml-2 text-xs">(w lodówce)</span>
                      )}
                      {isPartiallyInFridge && (
                        <span className="ml-2 text-xs">(częściowo w lodówce: {fridgeItem.quantity} {fridgeItem.unit})</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
            
            <button
              onClick={addIngredientsToShoppingList}
              className="w-full mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Dodaj brakujące składniki do zakupów
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;