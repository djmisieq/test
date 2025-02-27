import React, { useState, useEffect } from 'react';

const MealPlanner = ({ addItemsToShoppingList }) => {
  const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
  const mealTypes = ['Śniadanie', 'Obiad', 'Kolacja'];
  
  // Stan początkowy: pusty plan posiłków na każdy dzień
  const initialMealPlan = daysOfWeek.reduce((plan, day) => {
    plan[day] = mealTypes.reduce((meals, type) => {
      meals[type] = { name: '', ingredients: [] };
      return meals;
    }, {});
    return plan;
  }, {});

  const [mealPlan, setMealPlan] = useState(initialMealPlan);
  const [savedMealPlans, setSavedMealPlans] = useState([]);
  const [currentMealPlanName, setCurrentMealPlanName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [currentRecipe, setCurrentRecipe] = useState({ name: '', ingredients: [] });
  const [newIngredient, setNewIngredient] = useState({ name: '', category: 'Inne', quantity: '', unit: 'szt.' });
  
  // Przykładowe przepisy - można zastąpić własnymi lub pobrać z API
  const sampleRecipes = [
    {
      name: 'Omlet z warzywami',
      ingredients: [
        { name: 'Jajka', category: 'Nabiał', quantity: 2, unit: 'szt.' },
        { name: 'Papryka', category: 'Warzywa i Owoce', quantity: 1, unit: 'szt.' },
        { name: 'Cebula', category: 'Warzywa i Owoce', quantity: 0.5, unit: 'szt.' },
        { name: 'Ser żółty', category: 'Nabiał', quantity: 50, unit: 'g' }
      ]
    },
    {
      name: 'Spaghetti Bolognese',
      ingredients: [
        { name: 'Makaron spaghetti', category: 'Sypkie', quantity: 200, unit: 'g' },
        { name: 'Mięso mielone', category: 'Mięso i Wędliny', quantity: 300, unit: 'g' },
        { name: 'Passata pomidorowa', category: 'Inne', quantity: 1, unit: 'szt.' },
        { name: 'Cebula', category: 'Warzywa i Owoce', quantity: 1, unit: 'szt.' },
        { name: 'Czosnek', category: 'Warzywa i Owoce', quantity: 2, unit: 'ząbki' }
      ]
    }
  ];

  // Kategorie produktów
  const categories = [
    'Warzywa i Owoce', 
    'Pieczywo', 
    'Chemia', 
    'Mięso i Wędliny', 
    'Nabiał', 
    'Sypkie', 
    'Inne'
  ];

  // Jednostki miary
  const units = ['szt.', 'g', 'kg', 'ml', 'l', 'łyżka', 'łyżeczka', 'szklanka', 'opakowanie', 'ząbki', 'plasterki'];

  // Ładowanie zapisanych planów posiłków z localStorage
  useEffect(() => {
    const savedPlans = localStorage.getItem('mealPlans');
    if (savedPlans) {
      setSavedMealPlans(JSON.parse(savedPlans));
    }
  }, []);

  // Zapisywanie planów posiłków do localStorage
  useEffect(() => {
    if (savedMealPlans.length > 0) {
      localStorage.setItem('mealPlans', JSON.stringify(savedMealPlans));
    }
  }, [savedMealPlans]);

  // Otwiera modal do dodawania/edycji posiłku
  const openRecipeModal = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setCurrentRecipe(mealPlan[day][mealType] || { name: '', ingredients: [] });
    setShowRecipeModal(true);
  };

  // Obsługa zmiany nazwy przepisu
  const handleRecipeNameChange = (e) => {
    setCurrentRecipe({ ...currentRecipe, name: e.target.value });
  };

  // Obsługa zmiany składnika
  const handleIngredientChange = (field, value) => {
    setNewIngredient({ ...newIngredient, [field]: value });
  };

  // Dodaje nowy składnik do przepisu
  const addIngredient = () => {
    if (newIngredient.name.trim() === '') return;
    
    setCurrentRecipe({
      ...currentRecipe,
      ingredients: [...currentRecipe.ingredients, { ...newIngredient }]
    });
    
    // Reset formularza składnika
    setNewIngredient({ name: '', category: 'Inne', quantity: '', unit: 'szt.' });
  };

  // Usuwa składnik z przepisu
  const removeIngredient = (index) => {
    const updatedIngredients = [...currentRecipe.ingredients];
    updatedIngredients.splice(index, 1);
    setCurrentRecipe({ ...currentRecipe, ingredients: updatedIngredients });
  };

  // Zapisuje przepis do planu posiłków
  const saveRecipe = () => {
    if (currentRecipe.name.trim() === '') return;
    
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan[selectedDay][selectedMealType] = currentRecipe;
    setMealPlan(updatedMealPlan);
    setShowRecipeModal(false);
  };

  // Wybiera gotowy przepis z listy
  const selectSampleRecipe = (recipe) => {
    setCurrentRecipe(JSON.parse(JSON.stringify(recipe))); // Głęboka kopia
  };

  // Zapisuje plan posiłków
  const saveMealPlan = () => {
    if (currentMealPlanName.trim() === '') return;
    
    const newSavedPlans = [
      ...savedMealPlans,
      { name: currentMealPlanName, plan: JSON.parse(JSON.stringify(mealPlan)) }
    ];
    
    setSavedMealPlans(newSavedPlans);
    setCurrentMealPlanName('');
    setShowSaveModal(false);
  };

  // Wczytuje zapisany plan posiłków
  const loadMealPlan = (index) => {
    setMealPlan(JSON.parse(JSON.stringify(savedMealPlans[index].plan)));
  };

  // Usuwa zapisany plan posiłków
  const deleteMealPlan = (index) => {
    const updatedPlans = [...savedMealPlans];
    updatedPlans.splice(index, 1);
    setSavedMealPlans(updatedPlans);
  };

  // Generuje listę zakupów na podstawie planu posiłków
  const generateShoppingList = () => {
    // Zbieramy wszystkie składniki ze wszystkich przepisów
    const ingredients = [];
    
    // Iteracja po dniach i posiłkach
    Object.values(mealPlan).forEach(dayPlan => {
      Object.values(dayPlan).forEach(meal => {
        if (meal && meal.ingredients && meal.ingredients.length > 0) {
          ingredients.push(...meal.ingredients);
        }
      });
    });
    
    // Grupowanie składników tego samego typu i sumowanie ilości
    const groupedIngredients = {};
    ingredients.forEach(ing => {
      const key = `${ing.name}-${ing.unit}`;
      if (!groupedIngredients[key]) {
        groupedIngredients[key] = { ...ing };
      } else {
        groupedIngredients[key].quantity += ing.quantity;
      }
    });
    
    // Konwersja na listę zakupów
    const shoppingItems = Object.values(groupedIngredients).map(ing => ({
      name: `${ing.name} (${ing.quantity} ${ing.unit})`,
      category: ing.category,
      completed: false,
      id: Date.now() + Math.random()
    }));
    
    if (shoppingItems.length > 0 && typeof addItemsToShoppingList === 'function') {
      addItemsToShoppingList(shoppingItems);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Planer Posiłków</h2>
      
      {/* Pasek akcji */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Zapisz Plan
        </button>
        <button 
          onClick={generateShoppingList}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Generuj Listę Zakupów
        </button>
      </div>
      
      {/* Zapisane plany */}
      {savedMealPlans.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Zapisane Plany</h3>
          <div className="flex flex-wrap gap-2">
            {savedMealPlans.map((plan, index) => (
              <div key={index} className="border p-2 rounded dark:border-gray-600 flex items-center gap-2">
                <span className="text-gray-800 dark:text-gray-200">{plan.name}</span>
                <button 
                  onClick={() => loadMealPlan(index)} 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Wczytaj
                </button>
                <button 
                  onClick={() => deleteMealPlan(index)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tabela planu posiłków */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border dark:border-gray-600"></th>
              {mealTypes.map(mealType => (
                <th key={mealType} className="p-2 border dark:border-gray-600 text-gray-800 dark:text-gray-200">
                  {mealType}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map(day => (
              <tr key={day}>
                <td className="p-2 border dark:border-gray-600 font-medium text-gray-800 dark:text-gray-200">{day}</td>
                {mealTypes.map(mealType => (
                  <td key={`${day}-${mealType}`} className="p-2 border dark:border-gray-600">
                    {mealPlan[day][mealType].name ? (
                      <div className="relative group">
                        <div className="text-gray-800 dark:text-gray-200">{mealPlan[day][mealType].name}</div>
                        <div className="absolute hidden group-hover:block bg-white dark:bg-gray-700 shadow-md rounded p-2 z-10 top-full left-0 w-48">
                          <strong className="block mb-1 text-gray-800 dark:text-gray-200">Składniki:</strong>
                          <ul className="text-sm">
                            {mealPlan[day][mealType].ingredients.map((ing, idx) => (
                              <li key={idx} className="text-gray-700 dark:text-gray-300">
                                {ing.name} ({ing.quantity} {ing.unit})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button 
                          onClick={() => openRecipeModal(day, mealType)}
                          className="absolute right-0 top-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edytuj
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => openRecipeModal(day, mealType)}
                        className="w-full h-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        + Dodaj posiłek
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal zapisywania planu */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Zapisz Plan Posiłków</h3>
            <input
              type="text"
              placeholder="Nazwa planu posiłków"
              value={currentMealPlanName}
              onChange={(e) => setCurrentMealPlanName(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Anuluj
              </button>
              <button 
                onClick={saveMealPlan}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal dodawania/edycji przepisu */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {selectedDay} - {selectedMealType}
            </h3>
            
            {/* Wybór gotowego przepisu */}
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-200">Szybki wybór przepisu:</h4>
              <div className="flex flex-wrap gap-2">
                {sampleRecipes.map((recipe, idx) => (
                  <button 
                    key={idx}
                    onClick={() => selectSampleRecipe(recipe)}
                    className="px-3 py-1 border rounded-full text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                  >
                    {recipe.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Nazwa przepisu */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Nazwa posiłku:
              </label>
              <input
                type="text"
                value={currentRecipe.name}
                onChange={handleRecipeNameChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="np. Omlet z warzywami"
              />
            </div>
            
            {/* Składniki */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Składniki:
              </label>
              
              {/* Lista obecnych składników */}
              {currentRecipe.ingredients.length > 0 && (
                <ul className="mb-4 divide-y dark:divide-gray-600">
                  {currentRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="py-2 flex justify-between items-center">
                      <span className="text-gray-800 dark:text-gray-200">
                        {ing.name} ({ing.quantity} {ing.unit}) - {ing.category}
                      </span>
                      <button 
                        onClick={() => removeIngredient(idx)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Usuń
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              
              {/* Formularz nowego składnika */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Nazwa składnika"
                  value={newIngredient.name}
                  onChange={(e) => handleIngredientChange('name', e.target.value)}
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <select
                  value={newIngredient.category}
                  onChange={(e) => handleIngredientChange('category', e.target.value)}
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Ilość"
                  value={newIngredient.quantity}
                  onChange={(e) => handleIngredientChange('quantity', parseFloat(e.target.value) || '')}
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <select
                  value={newIngredient.unit}
                  onChange={(e) => handleIngredientChange('unit', e.target.value)}
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                <button 
                  onClick={addIngredient}
                  className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Dodaj składnik
                </button>
              </div>
            </div>
            
            {/* Przyciski akcji */}
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowRecipeModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Anuluj
              </button>
              <button 
                onClick={saveRecipe}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Zapisz Przepis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;