import React, { useState } from 'react';

const RecipeEditor = ({ recipes, saveRecipe, categories, darkMode }) => {
  // Bardzo uproszczona wersja dla demonstracji
  const [recipe, setRecipe] = useState({
    name: '',
    category: categories[0] || '',
    description: '',
    prepTimeMinutes: 30,
    servings: 2,
    difficulty: 'Średni',
    ingredients: [
      { name: '', quantity: '', unit: 'szt.', category: '' }
    ],
    steps: ['']
  });

  // Jednostki miary
  const units = ['szt.', 'g', 'kg', 'ml', 'l', 'łyżka', 'łyżeczka', 'szklanka', 'opak.'];
  
  // Stopnie trudności
  const difficultyLevels = ['Łatwy', 'Średni', 'Trudny'];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Funkcja zapisywania przepisu jest uproszczona w tej wersji.');
  };

  const handleCancel = () => {
    alert('Powrót do listy przepisów');
  };

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Dodaj nowy przepis
          </h2>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Dodaj przepis
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className={`px-4 py-2 rounded border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              Anuluj
            </button>
          </div>
        </div>

        {/* Podstawowe informacje */}
        <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="text-lg font-bold mb-4">Podstawowe informacje</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1">Nazwa przepisu*</label>
              <input
                type="text"
                value={recipe.name}
                onChange={(e) => setRecipe({...recipe, name: e.target.value})}
                className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                placeholder="Np. Spaghetti Bolognese"
              />
            </div>
            
            <div>
              <label className="block mb-1">Kategoria</label>
              <select
                value={recipe.category}
                onChange={(e) => setRecipe({...recipe, category: e.target.value})}
                className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Opis przepisu*</label>
            <textarea
              value={recipe.description}
              onChange={(e) => setRecipe({...recipe, description: e.target.value})}
              className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              placeholder="Krótki opis przepisu..."
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Czas przygotowania (minuty)*</label>
              <input
                type="number"
                value={recipe.prepTimeMinutes}
                onChange={(e) => setRecipe({...recipe, prepTimeMinutes: e.target.value})}
                className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                min="1"
              />
            </div>
            
            <div>
              <label className="block mb-1">Liczba porcji*</label>
              <input
                type="number"
                value={recipe.servings}
                onChange={(e) => setRecipe({...recipe, servings: e.target.value})}
                className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                min="1"
              />
            </div>
            
            <div>
              <label className="block mb-1">Stopień trudności</label>
              <select
                value={recipe.difficulty}
                onChange={(e) => setRecipe({...recipe, difficulty: e.target.value})}
                className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              >
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Składniki */}
        <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Składniki</h3>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800"
            >
              + Dodaj składnik
            </button>
          </div>
          
          <div className="grid grid-cols-12 gap-2 mb-3 p-2 rounded">
            <div className="col-span-5">
              <label className="block text-sm mb-1">Nazwa*</label>
              <input
                type="text"
                className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                placeholder="Np. Mąka pszenna"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm mb-1">Ilość*</label>
              <input
                type="text"
                className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                placeholder="Np. 200"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm mb-1">Jednostka</label>
              <select
                className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm mb-1">Kategoria</label>
              <select
                className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              >
                <option value="">Domyślna</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-1 flex items-end">
              <button
                type="button"
                className="text-red-600 hover:text-red-800 w-full py-2"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>

        {/* Kroki przygotowania */}
        <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Sposób przygotowania</h3>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800"
            >
              + Dodaj krok
            </button>
          </div>
          
          <div className="mb-3">
            <div className="flex items-start space-x-2">
              <div className="mt-2 font-bold">1.</div>
              <div className="flex-grow">
                <textarea
                  className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                  placeholder="Krok 1..."
                  rows="2"
                />
              </div>
              <button
                type="button"
                className="text-red-600 hover:text-red-800 mt-2"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>

        {/* Przyciski formularza */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className={`px-4 py-2 rounded border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
          >
            Anuluj
          </button>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Dodaj przepis
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeEditor;