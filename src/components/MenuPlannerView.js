import React, { useState } from 'react';
import MealPlanner from './MealPlanner';

const MenuPlannerView = ({ addItemsToShoppingList, recipes, fridgeItems, darkMode }) => {
  const [useRecipes, setUseRecipes] = useState(true);
  const [checkFridge, setCheckFridge] = useState(true);
  
  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h1 className="text-2xl font-bold mb-4">Planer Menu Tygodniowego</h1>
      
      <div className="mb-6">
        <p className="text-lg mb-4">
          Zaplanuj swoje posiłki na cały tydzień i wygeneruj listę zakupów za jednym kliknięciem.
        </p>
        
        <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <h2 className="text-lg font-semibold mb-2">Opcje planowania</h2>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useRecipes}
                onChange={() => setUseRecipes(!useRecipes)}
                className="mr-2 h-5 w-5"
              />
              <span>Używaj przepisów ({recipes.length} dostępnych)</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={checkFridge}
                onChange={() => setCheckFridge(!checkFridge)}
                className="mr-2 h-5 w-5"
              />
              <span>Sprawdź dostępność w lodówce ({fridgeItems.length} produktów)</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h3 className="font-bold mb-2">Planuj inteligentnie</h3>
            <p>Tworzenie planów posiłków pomaga ograniczyć marnowanie żywności i oszczędzać pieniądze.</p>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <h3 className="font-bold mb-2">Gotowe przepisy</h3>
            <p>Wybieraj z kolekcji własnych przepisów lub dodawaj nowe bezpośrednio z planera.</p>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <h3 className="font-bold mb-2">Integracja z lodówką</h3>
            <p>System automatycznie sprawdzi, jakie składniki masz już w lodówce.</p>
          </div>
        </div>
      </div>

      <MealPlanner 
        addItemsToShoppingList={addItemsToShoppingList} 
        recipes={useRecipes ? recipes : []} 
        fridgeItems={checkFridge ? fridgeItems : []} 
        darkMode={darkMode} 
      />
      
      {recipes.length === 0 && useRecipes && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          <p className="font-bold">Nie masz jeszcze żadnych przepisów</p>
          <p className="mt-2">Przejdź do zakładki "Przepisy", aby dodać swoje ulubione dania.</p>
        </div>
      )}
    </div>
  );
};

export default MenuPlannerView;