import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ShoppingListView from './components/ShoppingListView';
import TemplatesView from './components/TemplatesView';
import CategoriesView from './components/CategoriesView';
import SettingsView from './components/SettingsView';
import StoresView from './components/StoresView';
import BudgetView from './components/BudgetView';
import GroupedShoppingList from './components/GroupedShoppingList';
import MenuPlannerView from './components/MenuPlannerView';
import FridgeView from './components/FridgeView';
import RecipesView from './components/RecipesView';
import RecipeDetail from './components/RecipeDetail';
import RecipeEditor from './components/RecipeEditor';

// Domyślne kategorie jako stała (do wykorzystania przy resetowaniu)
const DEFAULT_CATEGORIES = [
  'Warzywa i Owoce', 
  'Pieczywo', 
  'Chemia', 
  'Mięso i Wędliny', 
  'Nabiał', 
  'Sypkie', 
  'Inne'
];

function App() {
  // Główne stany aplikacji
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [templates, setTemplates] = useState([]);
  const [stores, setStores] = useState([]);
  const [storesToVisit, setStoresToVisit] = useState([]);
  const [budget, setBudget] = useState({ total: 0 });
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [fridgeItems, setFridgeItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  
  // Stany UI
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('shopping-list');
  const [listViewMode, setListViewMode] = useState('standard'); // 'standard' lub 'grouped'
  
  // Stany formularzy i edycji
  const [newItem, setNewItem] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [filterCategory, setFilterCategory] = useState('Wszystkie');
  const [filterStore, setFilterStore] = useState('all');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [saveTemplateModalOpen, setSaveTemplateModalOpen] = useState(false);
  
  // Stan błędów
  const [error, setError] = useState(null);
  
  // Hooks routingu
  const navigate = useNavigate();
  const location = useLocation();
  
  // Usuwanie błędu po czasie
  useEffect(() => {
    let errorTimeout;
    if (error) {
      errorTimeout = setTimeout(() => setError(null), 5000);
    }
    return () => {
      if (errorTimeout) clearTimeout(errorTimeout);
    };
  }, [error]);
  
  // Przejście do odpowiedniego widoku na podstawie ścieżki URL
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/recipes')) {
      setActiveView('recipes');
    }
  }, [location.pathname]);
  
  // Ustaw domyślną kategorię, gdy kategorie zostaną załadowane
  useEffect(() => {
    if (categories.length > 0 && !newItemCategory) {
      setNewItemCategory(categories[0]);
    }
  }, [categories, newItemCategory]);

  // Ładowanie danych z localStorage
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('shoppingList');
      const savedDarkMode = localStorage.getItem('darkMode');
      const savedTemplates = localStorage.getItem('shoppingTemplates');
      const savedCategories = localStorage.getItem('shoppingCategories');
      const savedStores = localStorage.getItem('shoppingStores');
      const savedStoresToVisit = localStorage.getItem('shoppingStoresToVisit');
      const savedBudget = localStorage.getItem('shoppingBudget');
      const savedCategoryBudgets = localStorage.getItem('shoppingCategoryBudgets');
      const savedListViewMode = localStorage.getItem('shoppingListViewMode');
      const savedFridgeItems = localStorage.getItem('shoppingFridgeItems');
      const savedRecipes = localStorage.getItem('shoppingRecipes');
      
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      
      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode));
      }

      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      }

      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }

      if (savedStores) {
        setStores(JSON.parse(savedStores));
      }

      if (savedStoresToVisit) {
        setStoresToVisit(JSON.parse(savedStoresToVisit));
      }

      if (savedBudget) {
        setBudget(JSON.parse(savedBudget));
      }

      if (savedCategoryBudgets) {
        setCategoryBudgets(JSON.parse(savedCategoryBudgets));
      }
      
      if (savedListViewMode) {
        setListViewMode(JSON.parse(savedListViewMode));
      }
      
      if (savedFridgeItems) {
        setFridgeItems(JSON.parse(savedFridgeItems));
      }
      
      if (savedRecipes) {
        setRecipes(JSON.parse(savedRecipes));
      }
    } catch (e) {
      console.error("Błąd podczas ładowania danych z localStorage:", e);
      setError("Wystąpił problem podczas ładowania zapisanych danych. Niektóre dane mogły zostać utracone.");
    }
  }, []);

  // Bezpieczne zapisywanie do localStorage z debounce
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Błąd podczas zapisywania ${key} do localStorage:`, e);
      setError("Wystąpił problem podczas zapisywania danych. Zmiany mogą nie zostać zachowane.");
    }
  };
  
  // Debounce dla zapisywania często aktualizowanych danych
  useEffect(() => {
    const debouncedSave = setTimeout(() => {
      saveToLocalStorage('shoppingList', items);
      saveToLocalStorage('darkMode', darkMode);
    }, 500);
    
    return () => clearTimeout(debouncedSave);
  }, [items, darkMode]);

  useEffect(() => {
    saveToLocalStorage('shoppingTemplates', templates);
  }, [templates]);

  useEffect(() => {
    saveToLocalStorage('shoppingCategories', categories);
  }, [categories]);

  useEffect(() => {
    saveToLocalStorage('shoppingStores', stores);
  }, [stores]);

  useEffect(() => {
    saveToLocalStorage('shoppingStoresToVisit', storesToVisit);
  }, [storesToVisit]);

  useEffect(() => {
    saveToLocalStorage('shoppingBudget', budget);
  }, [budget]);

  useEffect(() => {
    saveToLocalStorage('shoppingCategoryBudgets', categoryBudgets);
  }, [categoryBudgets]);
  
  useEffect(() => {
    saveToLocalStorage('shoppingListViewMode', listViewMode);
  }, [listViewMode]);
  
  useEffect(() => {
    saveToLocalStorage('shoppingFridgeItems', fridgeItems);
  }, [fridgeItems]);
  
  useEffect(() => {
    saveToLocalStorage('shoppingRecipes', recipes);
  }, [recipes]);

  // Funkcje UI
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleListViewMode = () => {
    setListViewMode(listViewMode === 'standard' ? 'grouped' : 'standard');
  };
  
  // Zmiana aktywnego widoku z nawigacją
  const handleViewChange = (view) => {
    setActiveView(view);
    
    // Przekierowanie do odpowiedniej ścieżki, jeśli trzeba
    if (view === 'recipes') {
      navigate('/recipes');
    } else {
      navigate('/');
    }
  };
  
  // Funkcja do dodawania wielu przedmiotów na raz (np. z planera menu)
  const addItemsToShoppingList = (newItems) => {
    if (!Array.isArray(newItems) || newItems.length === 0) return;
    
    // Sprawdzamy, czy przedmioty o takich nazwach już istnieją
    const existingNames = new Set(items.map(item => item.name.toLowerCase()));
    
    // Filtrujemy tylko nowe przedmioty
    const uniqueNewItems = newItems.filter(item => 
      !existingNames.has(item.name.toLowerCase())
    );
    
    if (uniqueNewItems.length > 0) {
      setItems([...items, ...uniqueNewItems]);
      
      // Synchronizacja - aktualizacja stanu lodówki po dodaniu do listy zakupów
      // Zmniejszamy ilość w lodówce po dodaniu do zakupów
      const updatedFridgeItems = [...fridgeItems];
      uniqueNewItems.forEach(newItem => {
        const fridgeItemIndex = updatedFridgeItems.findIndex(item => 
          item.name.toLowerCase() === newItem.name.toLowerCase() && 
          item.unit === newItem.unit
        );
        
        if (fridgeItemIndex !== -1) {
          const fridgeItem = updatedFridgeItems[fridgeItemIndex];
          const newQuantity = Math.max(0, parseFloat(fridgeItem.quantity) - parseFloat(newItem.quantity || 0));
          
          if (newQuantity > 0) {
            updatedFridgeItems[fridgeItemIndex] = { ...fridgeItem, quantity: newQuantity };
          } else {
            // Usuń przedmiot z lodówki jeśli ilość jest 0
            updatedFridgeItems.splice(fridgeItemIndex, 1);
          }
        }
      });
      
      setFridgeItems(updatedFridgeItems);
    }
  };
  
  // Funkcje zarządzania szablonami
  const saveAsTemplate = () => {
    if (newTemplateName.trim() === '') return;
    
    // Filtrujemy tylko niezakończone elementy do szablonu i usuwamy pole completed
    const templateItems = items
      .filter(item => !item.completed)
      .map(({ id, name, category, stores, price, quantity }) => ({
        id: Date.now() + Math.random(), // Generujemy nowe ID dla szablonu
        name,
        category,
        stores: stores || [], // Zachowujemy przypisane sklepy
        price: price || 0,     // Zachowujemy cenę
        quantity: quantity || 1 // Zachowujemy ilość
      }));
    
    const newTemplate = {
      id: Date.now(),
      name: newTemplateName.trim(),
      items: templateItems
    };
    
    setTemplates([...templates, newTemplate]);
    setSaveTemplateModalOpen(false);
  };

  const loadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    // Dodaj elementy z szablonu do bieżącej listy,
    // ale tylko te, których jeszcze nie ma na liście
    const existingNames = new Set(items.map(item => item.name.toLowerCase()));
    
    const newItems = template.items
      .filter(item => !existingNames.has(item.name.toLowerCase()))
      .map(item => ({
        ...item,
        id: Date.now() + Math.random(), // Generujemy nowe unikalne ID
        completed: false,
        stores: item.stores || [], // Zachowujemy przypisane sklepy
        price: price => typeof price === 'number' ? price : 0,     // Bezpieczna konwersja ceny
        quantity: quantity => typeof quantity === 'number' && quantity > 0 ? quantity : 1 // Bezpieczna konwersja ilości
      }));
    
    if (newItems.length > 0) {
      setItems([...items, ...newItems]);
    }
  };

  const deleteTemplate = (templateId) => {
    setTemplates(templates.filter(template => template.id !== templateId));
  };

  // Funkcje zarządzania kategoriami
  const addCategory = (categoryName) => {
    if (categoryName.trim() === '') return;
    if (categories.includes(categoryName.trim())) return;
    
    setCategories([...categories, categoryName.trim()]);
  };

  const editCategory = (oldName, newName) => {
    if (newName.trim() === '' || oldName === newName) return;
    if (categories.includes(newName.trim())) return;
    
    // Aktualizujemy listę kategorii
    setCategories(categories.map(category => 
      category === oldName ? newName.trim() : category
    ));
    
    // Aktualizujemy kategorie produktów na liście
    setItems(items.map(item => 
      item.category === oldName ? { ...item, category: newName.trim() } : item
    ));
    
    // Aktualizujemy kategorie w szablonach
    setTemplates(templates.map(template => ({
      ...template,
      items: template.items.map(item => 
        item.category === oldName ? { ...item, category: newName.trim() } : item
      )
    })));
    
    // Aktualizujemy budżety kategorii
    if (categoryBudgets[oldName]) {
      const newBudgets = { ...categoryBudgets };
      newBudgets[newName.trim()] = newBudgets[oldName];
      delete newBudgets[oldName];
      setCategoryBudgets(newBudgets);
    }
    
    // Aktualizujemy kategorie w produktach lodówki
    setFridgeItems(fridgeItems.map(item => 
      item.category === oldName ? { ...item, category: newName.trim() } : item
    ));
    
    // Aktualizujemy kategorie w przepisach
    setRecipes(recipes.map(recipe => {
      // Aktualizujemy kategorię przepisu
      const updatedRecipe = recipe.category === oldName ? 
        { ...recipe, category: newName.trim() } : recipe;
      
      // Aktualizujemy kategorie składników przepisu
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        updatedRecipe.ingredients = updatedRecipe.ingredients.map(ingredient => 
          ingredient.category === oldName ? 
            { ...ingredient, category: newName.trim() } : ingredient
        );
      }
      
      return updatedRecipe;
    }));
  };

  const deleteCategory = (categoryName) => {
    // Sprawdzamy czy to nie jest ostatnia kategoria
    if (categories.length <= 1) return;
    
    // Wybieramy kategorię zastępczą (pierwsza dostępna inna niż usuwana)
    const fallbackCategory = categories.find(c => c !== categoryName) || 'Inne';
    
    // Usuwamy kategorię z listy
    setCategories(categories.filter(category => category !== categoryName));
    
    // Przenosimy produkty do kategorii zastępczej
    setItems(items.map(item => 
      item.category === categoryName ? { ...item, category: fallbackCategory } : item
    ));
    
    // Aktualizujemy kategorie w szablonach
    setTemplates(templates.map(template => ({
      ...template,
      items: template.items.map(item => 
        item.category === categoryName ? { ...item, category: fallbackCategory } : item
      )
    })));
    
    // Aktualizujemy budżety kategorii
    const newBudgets = { ...categoryBudgets };
    delete newBudgets[categoryName];
    setCategoryBudgets(newBudgets);
    
    // Aktualizujemy filtr kategorii jeśli trzeba
    if (filterCategory === categoryName) {
      setFilterCategory('Wszystkie');
    }
    
    // Aktualizujemy kategorię nowego przedmiotu jeśli trzeba
    if (newItemCategory === categoryName) {
      setNewItemCategory(fallbackCategory);
    }
    
    // Aktualizujemy kategorie w produktach lodówki
    setFridgeItems(fridgeItems.map(item => 
      item.category === categoryName ? { ...item, category: fallbackCategory } : item
    ));
    
    // Aktualizujemy kategorie w przepisach
    setRecipes(recipes.map(recipe => {
      // Aktualizujemy kategorię przepisu
      const updatedRecipe = recipe.category === categoryName ? 
        { ...recipe, category: fallbackCategory } : recipe;
      
      // Aktualizujemy kategorie składników przepisu
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        updatedRecipe.ingredients = updatedRecipe.ingredients.map(ingredient => 
          ingredient.category === categoryName ? 
            { ...ingredient, category: fallbackCategory } : ingredient
        );
      }
      
      return updatedRecipe;
    }));
  };

  const resetCategories = () => {
    // Mapujemy stare kategorie do domyślnych
    const categoryMap = {};
    categories.forEach((category, index) => {
      if (index < DEFAULT_CATEGORIES.length) {
        categoryMap[category] = DEFAULT_CATEGORIES[index];
      } else {
        categoryMap[category] = DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]; // Mapujemy nadmiarowe do "Inne"
      }
    });
    
    // Aktualizujemy kategorie produktów
    setItems(items.map(item => ({
      ...item,
      category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
    })));
    
    // Aktualizujemy kategorie w szablonach
    setTemplates(templates.map(template => ({
      ...template,
      items: template.items.map(item => ({
        ...item,
        category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
      }))
    })));
    
    // Aktualizujemy budżety kategorii
    const newBudgets = {};
    Object.entries(categoryBudgets).forEach(([category, value]) => {
      if (categoryMap[category]) {
        newBudgets[categoryMap[category]] = value;
      }
    });
    setCategoryBudgets(newBudgets);
    
    // Aktualizujemy kategorie w produktach lodówki
    setFridgeItems(fridgeItems.map(item => ({
      ...item,
      category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
    })));
    
    // Aktualizujemy kategorie w przepisach
    setRecipes(recipes.map(recipe => {
      // Aktualizujemy kategorię przepisu
      const updatedRecipe = {
        ...recipe,
        category: categoryMap[recipe.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
      };
      
      // Aktualizujemy kategorie składników przepisu
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        updatedRecipe.ingredients = updatedRecipe.ingredients.map(ingredient => ({
          ...ingredient,
          category: categoryMap[ingredient.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
        }));
      }
      
      return updatedRecipe;
    }));
    
    // Przywracamy domyślne kategorie
    setCategories([...DEFAULT_CATEGORIES]);
    
    // Aktualizujemy filtr i kategorię nowego przedmiotu
    setFilterCategory('Wszystkie');
    setNewItemCategory(DEFAULT_CATEGORIES[0]);
  };

  // Funkcje zarządzania sklepami
  const addStore = (store) => {
    setStores([...stores, store]);
  };

  const editStore = (storeId, storeData) => {
    setStores(stores.map(store => 
      store.id === storeId 
        ? { ...store, ...storeData } 
        : store
    ));
  };

  const deleteStore = (storeId) => {
    // Usuwamy sklep z listy
    setStores(stores.filter(store => store.id !== storeId));
    
    // Usuwamy referencje do sklepu z produktów
    setItems(items.map(item => ({
      ...item,
      stores: item.stores 
        ? item.stores.filter(id => id !== storeId)
        : []
    })));
    
    // Usuwamy referencje do sklepu z szablonów
    setTemplates(templates.map(template => ({
      ...template,
      items: template.items.map(item => ({
        ...item,
        stores: item.stores 
          ? item.stores.filter(id => id !== storeId)
          : []
      }))
    })));
    
    // Usuwamy ze sklepów do odwiedzenia
    setStoresToVisit(storesToVisit.filter(id => id !== storeId));
    
    // Resetujemy filtr sklepu jeśli trzeba
    if (filterStore === storeId) {
      setFilterStore('all');
    }
  };

  const setStoreToVisit = (storeId, toVisit) => {
    if (toVisit) {
      if (!storesToVisit.includes(storeId)) {
        setStoresToVisit([...storesToVisit, storeId]);
      }
    } else {
      setStoresToVisit(storesToVisit.filter(id => id !== storeId));
    }
  };

  const calculateOptimalRoute = (storeIds) => {
    console.log("Obliczanie optymalnej trasy dla sklepów:", storeIds);
    // W rzeczywistej implementacji tutaj byłoby połączenie z API map
    // Na potrzeby demonstracji zwracamy po prostu te same sklepy
    return storeIds;
  };

  const updateItemStores = (itemId, storeIds) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, stores: storeIds } 
        : item
    ));
  };

  // Funkcje zarządzania budżetem
  const updateBudget = (newBudget) => {
    setBudget(newBudget);
  };

  const updateCategoryBudget = (category, amount) => {
    setCategoryBudgets({
      ...categoryBudgets,
      [category]: amount
    });
  };

  const updateItemPrice = (itemId, price, quantity) => {
    try {
      const parsedPrice = parseFloat(price);
      const parsedQuantity = parseFloat(quantity);
      
      // Sprawdzanie czy dane są poprawne
      if (isNaN(parsedPrice) || isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new Error("Nieprawidłowa cena lub ilość");
      }
      
      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, price: parsedPrice, quantity: parsedQuantity } 
          : item
      ));
    } catch (e) {
      console.error("Błąd podczas aktualizacji ceny produktu:", e);
      setError("Wprowadzono nieprawidłową cenę lub ilość. Sprawdź dane i spróbuj ponownie.");
    }
  };

  // Obliczanie aktualnych kosztów dla listy zakupów
  const calculateTotalCost = () => {
    return items.reduce((total, item) => {
      if (!item.completed && item.price) {
        const price = parseFloat(item.price) || 0;
        const quantity = parseFloat(item.quantity) || 1;
        if (!isNaN(price) && !isNaN(quantity)) {
          return total + (price * quantity);
        }
      }
      return total;
    }, 0);
  };

  const totalCost = calculateTotalCost();
  const totalBudget = budget?.total || 0;
  const remainingBudget = totalBudget - totalCost;
  
  // Funkcje zarządzania lodówką i przepisami
  
  // Zapisywanie przepisu
  const saveRecipe = (recipe) => {
    try {
      // Walidacja danych przepisu
      if (!recipe.name || recipe.name.trim() === '') {
        throw new Error("Nazwa przepisu jest wymagana");
      }
      
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        throw new Error("Przepis musi zawierać co najmniej jeden składnik");
      }
      
      // Walidacja składników
      recipe.ingredients.forEach(ingredient => {
        if (!ingredient.name || ingredient.name.trim() === '') {
          throw new Error("Wszystkie składniki muszą mieć nazwę");
        }
        
        const quantity = parseFloat(ingredient.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(`Nieprawidłowa ilość dla składnika ${ingredient.name}`);
        }
      });
      
      // Jeśli przepis ma już ID, aktualizujemy go
      if (recipe.id) {
        setRecipes(recipes.map(r => 
          r.id === recipe.id ? recipe : r
        ));
      } else {
        // W przeciwnym razie dodajemy nowy przepis
        const newRecipe = {
          ...recipe,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        setRecipes([...recipes, newRecipe]);
      }
      
      // Przejście z powrotem do listy przepisów po zapisie
      navigate('/recipes');
    } catch (e) {
      console.error("Błąd podczas zapisywania przepisu:", e);
      setError(e.message || "Wystąpił błąd podczas zapisywania przepisu");
    }
  };
  
  // Usuwanie przepisu
  const deleteRecipe = (recipeId) => {
    setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
  };

  // Renderowanie komponentu listy zakupów
  const renderShoppingList = () => {
    if (listViewMode === 'grouped') {
      return (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lista Zakupów - Wg Sklepów</h2>
            <button 
              onClick={toggleListViewMode}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Widok Standardowy
            </button>
          </div>
          <GroupedShoppingList 
            items={items.filter(item => {
              // Filtrowanie według kategorii
              if (filterCategory !== 'Wszystkie' && item.category !== filterCategory) {
                return false;
              }
              // Filtrowanie według sklepu
              if (filterStore !== 'all') {
                return item.stores && item.stores.includes(filterStore);
              }
              return true;
            })}
            stores={stores}
            toggleComplete={(itemId) => {
              setItems(items.map(item => 
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ));
            }}
            deleteItem={(itemId) => {
              setItems(items.filter(item => item.id !== itemId));
            }}
            startEditing={(itemId) => {
              const item = items.find(i => i.id === itemId);
              if (item) {
                setEditingItem(itemId);
                setEditItemName(item.name);
              }
            }}
            updateItemStores={updateItemStores}
          />
        </div>
      );
    }
    
    return (
      <ShoppingListView
        items={items}
        setItems={setItems}
        categories={categories}
        newItem={newItem}
        setNewItem={setNewItem}
        newItemCategory={newItemCategory}
        setNewItemCategory={setNewItemCategory}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        editItemName={editItemName}
        setEditItemName={setEditItemName}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        saveTemplateModalOpen={saveTemplateModalOpen}
        setSaveTemplateModalOpen={setSaveTemplateModalOpen}
        newTemplateName={newTemplateName}
        setNewTemplateName={setNewTemplateName}
        saveAsTemplate={saveAsTemplate}
        templates={templates}
        loadTemplate={loadTemplate}
        stores={stores}
        updateItemStores={updateItemStores}
        filterStore={filterStore}
        setFilterStore={setFilterStore}
        updateItemPrice={updateItemPrice}
        totalBudget={totalBudget}
        remainingBudget={remainingBudget}
        showBudgetSummary={totalBudget > 0}
        darkMode={darkMode}
        toggleListViewMode={toggleListViewMode}
        listViewMode={listViewMode}
      />
    );
  };

  // Render głównego widoku na podstawie ścieżki i activeView
  const renderMainContent = () => {
    // Jeśli jesteśmy na ścieżce /recipes, renderuj Routes dla przepisów
    if (location.pathname.startsWith('/recipes')) {
      return (
        <Routes>
          <Route path="/recipes" element={
            <RecipesView
              recipes={recipes || []}
              deleteRecipe={deleteRecipe}
              categories={categories || []}
              darkMode={darkMode}
            />
          } />
          <Route path="/recipes/recipe/:id" element={
            <RecipeDetail
              recipes={recipes || []}
              addItemsToShoppingList={addItemsToShoppingList}
              fridgeItems={fridgeItems || []}
              darkMode={darkMode}
            />
          } />
          <Route path="/recipes/recipe/edit/:id" element={
            <RecipeEditor
              recipes={recipes || []}
              saveRecipe={saveRecipe}
              categories={categories || []}
              darkMode={darkMode}
            />
          } />
          <Route path="/recipes/recipe/new" element={
            <RecipeEditor
              recipes={recipes || []}
              saveRecipe={saveRecipe}
              categories={categories || []}
              darkMode={darkMode}
            />
          } />
          <Route path="*" element={<Navigate to="/recipes" />} />
        </Routes>
      );
    }
    
    // W przeciwnym razie, renderuj widok na podstawie activeView
    switch(activeView) {
      case 'shopping-list':
        return renderShoppingList();
        
      case 'fridge':
        return (
          <FridgeView
            fridgeItems={fridgeItems || []}
            setFridgeItems={setFridgeItems}
            categories={categories || []}
            darkMode={darkMode}
          />
        );
        
      case 'recipes':
        // Jeśli ktoś próbuje uzyskać dostęp do przepisów przez activeView, przekieruj do /recipes
        navigate('/recipes');
        return null;
        
      case 'templates':
        return (
          <TemplatesView
            templates={templates || []}
            loadTemplate={loadTemplate}
            deleteTemplate={deleteTemplate}
            darkMode={darkMode}
          />
        );
        
      case 'categories':
        return (
          <CategoriesView
            categories={categories || []}
            addCategory={addCategory}
            editCategory={editCategory}
            deleteCategory={deleteCategory}
            resetCategories={resetCategories}
            darkMode={darkMode}
          />
        );
        
      case 'stores':
        return (
          <StoresView
            stores={stores || []}
            addStore={addStore}
            editStore={editStore}
            deleteStore={deleteStore}
            setStoreToVisit={setStoreToVisit}
            calculateOptimalRoute={calculateOptimalRoute}
            darkMode={darkMode}
          />
        );
        
      case 'budget':
        return (
          <BudgetView
            budget={budget || { total: 0 }}
            updateBudget={updateBudget}
            categoryBudgets={categoryBudgets || {}}
            updateCategoryBudget={updateCategoryBudget}
            items={items || []}
            categories={categories || []}
            darkMode={darkMode}
          />
        );
        
      case 'menu-planner':
        return (
          <MenuPlannerView
            addItemsToShoppingList={addItemsToShoppingList}
            recipes={recipes || []}
            fridgeItems={fridgeItems || []}
            darkMode={darkMode}
          />
        );
        
      case 'settings':
        return (
          <SettingsView
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      {/* Komunikat o błędzie */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <p>{error}</p>
            <button 
              className="ml-4 text-white hover:text-red-200"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <Layout
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeView={activeView}
        setActiveView={handleViewChange}
        toggleDarkMode={toggleDarkMode}
        itemsCount={items?.length || 0}
        templatesCount={templates?.length || 0}
        categoriesCount={categories?.length || 0}
        storesCount={stores?.length || 0}
        storesToVisitCount={storesToVisit?.length || 0}
        fridgeItemsCount={fridgeItems?.length || 0}
        recipesCount={recipes?.length || 0}
        showBudget={true}
        budgetAmount={budget?.total || 0}
        remainingBudget={remainingBudget}
      >
        {renderMainContent()}
      </Layout>
    </>
  );
}

export default App;