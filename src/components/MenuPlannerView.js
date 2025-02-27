import React from 'react';
import MealPlanner from './MealPlanner';

const MenuPlannerView = ({ addItemsToShoppingList, darkMode }) => {
  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">Planer Menu Tygodniowego</h1>
      <div className="mb-4">
        <p className="text-lg mb-2">
          Zaplanuj swoje posiłki na cały tydzień i wygeneruj listę zakupów za jednym kliknięciem.
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Twórz i zapisuj plany posiłków</li>
          <li>Wybieraj z gotowych przepisów lub dodawaj własne</li>
          <li>Automatycznie generuj listę zakupów na podstawie planu</li>
          <li>Oszczędzaj czas i pieniądze dzięki zaplanowanym zakupom</li>
        </ul>
      </div>

      <MealPlanner addItemsToShoppingList={addItemsToShoppingList} />
    </div>
  );
};

export default MenuPlannerView;