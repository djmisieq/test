import React, { useState } from 'react';

function BudgetView({ 
  budget, 
  updateBudget, 
  categoryBudgets,
  updateCategoryBudget, 
  items, 
  categories,
  darkMode 
}) {
  const [editingTotal, setEditingTotal] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState(budget?.total || 0);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryBudget, setNewCategoryBudget] = useState(0);
  
  // Obliczenie całkowitej kwoty zakupów i wydatków wg kategorii
  const calculateTotals = () => {
    let totalSpent = 0;
    const categorySpending = {};
    
    // Inicjalizacja kategorii
    categories.forEach(category => {
      categorySpending[category] = 0;
    });
    
    // Obliczenie wydatków
    items.forEach(item => {
      if (item.price && !item.completed) {
        const itemTotal = item.price * (item.quantity || 1);
        totalSpent += itemTotal;
        
        if (categorySpending[item.category] !== undefined) {
          categorySpending[item.category] += itemTotal;
        }
      }
    });
    
    return { totalSpent, categorySpending };
  };
  
  const { totalSpent, categorySpending } = calculateTotals();
  const totalBudget = budget?.total || 0;
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  // Obsługa edycji całkowitego budżetu
  const handleTotalBudgetEdit = () => {
    setEditingTotal(true);
    setNewTotalBudget(totalBudget);
  };
  
  const saveTotalBudget = () => {
    const newTotal = parseFloat(newTotalBudget);
    if (!isNaN(newTotal) && newTotal >= 0) {
      updateBudget({ 
        ...budget, 
        total: newTotal 
      });
    }
    setEditingTotal(false);
  };
  
  // Obsługa edycji budżetu kategorii
  const handleCategoryBudgetEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryBudget(categoryBudgets[category] || 0);
  };
  
  const saveCategoryBudget = () => {
    if (editingCategory) {
      const newBudget = parseFloat(newCategoryBudget);
      if (!isNaN(newBudget) && newBudget >= 0) {
        updateCategoryBudget(editingCategory, newBudget);
      }
      setEditingCategory(null);
    }
  };
  
  // Formatowanie kwoty do wyświetlenia
  const formatCurrency = (amount) => {
    return amount.toLocaleString('pl-PL', { 
      style: 'currency', 
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Określenie koloru paska postępu i tekstu
  const getBudgetStatusColor = (spent, budgetAmount) => {
    if (budgetAmount === 0) return 'bg-gray-300';
    
    const percentage = (spent / budgetAmount) * 100;
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getTextStatusColor = (spent, budgetAmount) => {
    if (budgetAmount === 0) return '';
    
    const percentage = (spent / budgetAmount) * 100;
    if (percentage < 70) return darkMode ? 'text-green-400' : 'text-green-600';
    if (percentage < 90) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className={`${darkMode ? 'dark:bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-4 md:p-6`}>
      <h2 className="text-xl font-bold mb-6">Budżet zakupowy</h2>
      
      {/* Podsumowanie budżetu */}
      <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Całkowity budżet</h3>
          {editingTotal ? (
            <div className="flex">
              <input
                type="number"
                min="0"
                step="0.01"
                value={newTotalBudget}
                onChange={(e) => setNewTotalBudget(e.target.value)}
                className={`w-24 p-1 mr-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                autoFocus
              />
              <button
                onClick={saveTotalBudget}
                className={`px-2 py-1 rounded ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                OK
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="font-bold text-lg mr-2">{formatCurrency(totalBudget)}</span>
              <button
                onClick={handleTotalBudgetEdit}
                className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                ✎
              </button>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Wydatki</span>
            <span>{formatCurrency(totalSpent)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Pozostało</span>
            <span className={getTextStatusColor(totalSpent, totalBudget)}>{formatCurrency(totalRemaining)}</span>
          </div>
          <div className="h-2 bg-gray-300 rounded-full mt-2">
            <div 
              className={`h-full rounded-full ${getBudgetStatusColor(totalSpent, totalBudget)}`}
              style={{ width: `${Math.min(totalPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1 opacity-70">
            <span>0%</span>
            <span>{Math.round(totalPercentage)}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      {/* Budżety kategorii */}
      <div>
        <h3 className="font-semibold mb-4">Budżety poszczególnych kategorii</h3>
        
        {categories.length === 0 ? (
          <p className="text-center py-4">Brak kategorii do wyświetlenia.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              const spent = categorySpending[category] || 0;
              const categoryBudget = categoryBudgets[category] || 0;
              const remaining = categoryBudget - spent;
              const percentage = categoryBudget > 0 ? (spent / categoryBudget) * 100 : 0;
              
              return (
                <div key={category} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{category}</h4>
                    {editingCategory === category ? (
                      <div className="flex">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newCategoryBudget}
                          onChange={(e) => setNewCategoryBudget(e.target.value)}
                          className={`w-24 p-1 mr-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                          autoFocus
                        />
                        <button
                          onClick={saveCategoryBudget}
                          className={`px-2 py-1 rounded ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className={`mr-2 ${getTextStatusColor(spent, categoryBudget)}`}>
                          {formatCurrency(categoryBudget)}
                        </span>
                        <button
                          onClick={() => handleCategoryBudgetEdit(category)}
                          className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        >
                          ✎
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm flex justify-between mb-1">
                    <span>Wydano: {formatCurrency(spent)}</span>
                    <span className={getTextStatusColor(spent, categoryBudget)}>
                      Pozostało: {formatCurrency(remaining)}
                    </span>
                  </div>
                  
                  <div className="h-2 bg-gray-300 rounded-full">
                    <div 
                      className={`h-full rounded-full ${getBudgetStatusColor(spent, categoryBudget)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetView;