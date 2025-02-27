import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MealPlanner = ({ addItemsToShoppingList, recipes = [], fridgeItems = [], darkMode }) => {
  const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
  const mealTypes = ['Śniadanie', 'Obiad', 'Kolacja'];
  
  // Stan początkowy: pusty plan posiłków na każdy dzień
  const initialMealPlan = daysOfWeek.reduce((plan, day) => {
    plan[day] = mealTypes.reduce((meals, type) => {
      meals[type] = { name: '', ingredients: [], recipeId: null };
      return meals;
    }, {});
    return plan;
  }, {});

  const [mealPlan, setMealPlan] = useState(initialMealPlan);
  const [savedMealPlans, setSavedMealPlans] = useState([]);
  const [currentMealPlanName, setCurrentMealPlanName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showCustomRecipeModal, setShowCustomRecipeModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [currentRecipe, setCurrentRecipe] = useState({ name: '', ingredients: [] });
  const [newIngredient, setNewIngredient] = useState({ name: '', category: 'Inne', quantity: '', unit: 'szt.' });
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
  
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
  const units = ['szt.', 'g', 'kg', 'ml', 'l', 'łyżka', 'łyżeczka', 'szklanka', 'opak.', 'ząbki', 'plasterki'];

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
    setRecipeSearchQuery('');
  };

  // Otwiera modal do tworzenia własnego przepisu
  const openCustomRecipeModal = () => {
    setShowRecipeModal(false);
    setShowCustomRecipeModal(true);
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
    if (!newIngredient.quantity) return;
    
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
    setShowCustomRecipeModal(false);
  };

  // Wybiera przepis z biblioteki
  const selectRecipe = (recipe) => {
    const recipeToAdd = {
      name: recipe.name,
      ingredients: [...recipe.ingredients],
      recipeId: recipe.id
    };
    setCurrentRecipe(recipeToAdd);
    setShowRecipeModal(false);
    
    // Automatycznie zapisz wybrany przepis do planu
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan[selectedDay][selectedMealType] = recipeToAdd;
    setMealPlan(updatedMealPlan);
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

  // Generuje listę zakupów na podstawie planu posiłków z uwzględnieniem zawartości lodówki
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
        groupedIngredients[key].quantity = parseFloat(groupedIngredients[key].quantity) + parseFloat(ing.quantity);
      }
    });
    
    // Sprawdzanie zawartości lodówki i dostosowanie listy zakupów
    const shoppingItems = [];
    
    Object.values(groupedIngredients).forEach(ing => {
      // Sprawdzenie czy składnik jest w lodówce
      const fridgeItem = fridgeItems.find(item => 
        item.name.toLowerCase() === ing.name.toLowerCase() && 
        item.unit === ing.unit
      );
      
      if (!fridgeItem) {
        // Składnika nie ma w lodówce, dodaj całą ilość do listy zakupów
        shoppingItems.push({
          name: ing.name,
          category: ing.category,
          quantity: parseFloat(ing.quantity),
          unit: ing.unit,
          completed: false,
          id: Date.now() + Math.random()
        });
      } else if (parseFloat(fridgeItem.quantity) < parseFloat(ing.quantity)) {
        // Składnik jest w lodówce, ale w niewystarczającej ilości
        const neededQuantity = parseFloat(ing.quantity) - parseFloat(fridgeItem.quantity);
        shoppingItems.push({
          name: ing.name,
          category: ing.category,
          quantity: neededQuantity,
          unit: ing.unit,
          completed: false,
          id: Date.now() + Math.random()
        });
      }
      // Jeśli składnik jest w lodówce w wystarczającej ilości, pomijamy go
    });
    
    if (shoppingItems.length > 0 && typeof addItemsToShoppingList === 'function') {
      addItemsToShoppingList(shoppingItems);
      alert(`Dodano ${shoppingItems.length} produktów do listy zakupów.`);
    } else if (shoppingItems.length === 0) {
      alert('Wszystkie potrzebne produkty są już w lodówce!');
    }
  };
  
  // Filtrowanie przepisów według wyszukiwanej frazy
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()) ||
    recipe.ingredients.some(ing => ing.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()))
  );

  return (
    <div className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
      {/* Pasek akcji */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Zapisz Plan
        </button>
        <button 
          onClick={generateShoppingList}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Generuj Listę Zakupów
        </button>
      </div>
      
      {/* Zapisane plany */}
      {savedMealPlans.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Zapisane Plany</h3>
          <div className="flex flex-wrap gap-2">
            {savedMealPlans.map((plan, index) => (
              <div key={index} className={`border p-2 rounded flex items-center gap-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <span>{plan.name}</span>
                <button 
                  onClick={() => loadMealPlan(index)} 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Wczytaj
                </button>
                <button 
                  onClick={() => deleteMealPlan(index)}
                  className="text-red-600 hover:text-red-800"
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
              <th className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></th>
              {mealTypes.map(mealType => (
                <th key={mealType} className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  {mealType}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map(day => (
              <tr key={day}>
                <td className={`p-2 border font-medium ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>{day}</td>
                {mealTypes.map(mealType => (
                  <td key={`${day}-${mealType}`} className={`p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    {mealPlan[day][mealType].name ? (
                      <div className="relative group">
                        <div className="font-medium">{mealPlan[day][mealType].name}</div>
                        <div className={`absolute hidden group-hover:block ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-md rounded p-2 z-10 top-full left-0 w-64`}>
                          <strong className="block mb-1">Składniki:</strong>
                          <ul className="text-sm">
                            {mealPlan[day][mealType].ingredients.map((ing, idx) => {
                              // Sprawdzenie czy składnik jest w lodówce
                              const fridgeItem = fridgeItems.find(item => 
                                item.name.toLowerCase() === ing.name.toLowerCase() && 
                                item.unit === ing.unit
                              );
                              
                              const isInFridge = fridgeItem && parseFloat(fridgeItem.quantity) >= parseFloat(ing.quantity);
                              const isPartiallyInFridge = fridgeItem && parseFloat(fridgeItem.quantity) < parseFloat(ing.quantity);
                              
                              return (
                                <li key={idx} className={`
                                  ${isInFridge ? 'text-green-600' : ''}
                                  ${isPartiallyInFridge ? 'text-yellow-600' : ''}
                                `}>
                                  {ing.name} ({ing.quantity} {ing.unit})
                                  {isInFridge && ' ✅'}
                                  {isPartiallyInFridge && ' ⚠️'}
                                </li>
                              );
                            })}
                          </ul>
                          {mealPlan[day][mealType].recipeId && (
                            <Link 
                              to={`/recipe/${mealPlan[day][mealType].recipeId}`}
                              className="mt-2 block text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Zobacz pełny przepis
                            </Link>
                          )}
                        </div>
                        <div className="absolute right-0 top-0 flex">
                          <button 
                            onClick={() => openRecipeModal(day, mealType)}
                            className="text-blue-600 hover:text-blue-800 mr-1"
                          >
                            Zmień
                          </button>
                          <button 
                            onClick={() => {
                              const updatedMealPlan = { ...mealPlan };
                              updatedMealPlan[day][mealType] = { name: '', ingredients: [] };
                              setMealPlan(updatedMealPlan);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => openRecipeModal(day, mealType)}
                        className={`w-full h-full p-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
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
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
            <h3 className="text-xl font-bold mb-4">Zapisz Plan Posiłków</h3>
            <input
              type="text"
              placeholder="Nazwa planu posiłków"
              value={currentMealPlanName}
              onChange={(e) => setCurrentMealPlanName(e.target.value)}
              className={`w-full p-2 border rounded mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowSaveModal(false)}
                className={`px-4 py-2 border rounded-md ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                Anuluj
              </button>
              <button 
                onClick={saveMealPlan}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal wyboru przepisu */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
            <h3 className="text-xl font-bold mb-4">
              Dodaj posiłek: {selectedDay} - {selectedMealType}
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Wybierz z biblioteki przepisów:</h4>
                <button 
                  onClick={openCustomRecipeModal}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Stwórz własny
                </button>
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Szukaj przepisu..."
                  value={recipeSearchQuery}
                  onChange={(e) => setRecipeSearchQuery(e.target.value)}
                  className={`w-full p-2 border rounded mb-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRecipes.map((recipe) => (
                    <div 
                      key={recipe.id} 
                      className={`border rounded p-3 cursor-pointer hover:shadow-md ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => selectRecipe(recipe)}
                    >
                      <div className="font-bold mb-1">{recipe.name}</div>
                      <div className="text-sm">
                        <span className="font-medium">Składniki:</span> 
                        {recipe.ingredients.slice(0, 3).map(i => i.name).join(', ')}
                        {recipe.ingredients.length > 3 && '...'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : recipes.length > 0 ? (
                <p className="text-center py-4">
                  Brak wyników dla "{recipeSearchQuery}". Spróbuj innej frazy lub stwórz własny przepis.
                </p>
              ) : (
                <p className="text-center py-4">
                  Brak przepisów w bibliotece. Możesz utworzyć własny przepis lub dodać nowe w zakładce Przepisy.
                </p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={() => setShowRecipeModal(false)}
                className={`px-4 py-2 border rounded-md ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal tworzenia własnego przepisu */}
      {showCustomRecipeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <h3 className="text-xl font-bold mb-4">
              Utwórz własny posiłek: {selectedDay} - {selectedMealType}
            </h3>
            
            {/* Nazwa przepisu */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Nazwa posiłku:
              </label>
              <input
                type="text"
                value={currentRecipe.name}
                onChange={handleRecipeNameChange}
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="np. Omlet z warzywami"
              />
            </div>
            
            {/* Składniki */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Składniki:
              </label>
              
              {/* Lista obecnych składników */}
              {currentRecipe.ingredients.length > 0 && (
                <ul className={`mb-4 divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                  {currentRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="py-2 flex justify-between items-center">
                      <span>
                        {ing.name} ({ing.quantity} {ing.unit}) - {ing.category}
                      </span>
                      <button 
                        onClick={() => removeIngredient(idx)}
                        className="text-red-600 hover:text-red-800"
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
                  className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
                <select
                  value={newIngredient.category}
                  onChange={(e) => handleIngredientChange('category', e.target.value)}
                  className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
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
                  onChange={(e) => handleIngredientChange('quantity', e.target.value)}
                  className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
                <select
                  value={newIngredient.unit}
                  onChange={(e) => handleIngredientChange('unit', e.target.value)}
                  className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
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
                onClick={() => setShowCustomRecipeModal(false)}
                className={`px-4 py-2 border rounded-md ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                Anuluj
              </button>
              <button 
                onClick={saveRecipe}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={currentRecipe.name.trim() === '' || currentRecipe.ingredients.length === 0}
              >
                Zapisz Posiłek
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;