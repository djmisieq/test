import React, { useState, useEffect } from 'react';
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
  
  // Ustaw domyślną kategorię, gdy kategorie zostaną załadowane
  useEffect(() => {
    if (categories.length > 0 && !newItemCategory) {
      setNewItemCategory(categories[0]);
    }
  }, [categories, newItemCategory]);

  // Ładowanie danych z localStorage
  useEffect(() => {
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
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Error parsing saved items:", e);
      }
    }
    
    if (savedDarkMode) {
      try {
        setDarkMode(JSON.parse(savedDarkMode));
      } catch (e) {
        console.error("Error parsing dark mode setting:", e);
      }
    }

    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error("Error parsing saved templates:", e);
      }
    }

    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error("Error parsing saved categories:", e);
        setCategories(DEFAULT_CATEGORIES);
      }
    }

    if (savedStores) {
      try {
        setStores(JSON.parse(savedStores));
      } catch (e) {
        console.error("Error parsing saved stores:", e);
      }
    }

    if (savedStoresToVisit) {
      try {
        setStoresToVisit(JSON.parse(savedStoresToVisit));
      } catch (e) {
        console.error("Error parsing stores to visit:", e);
      }
    }

    if (savedBudget) {
      try {
        setBudget(JSON.parse(savedBudget));
      } catch (e) {
        console.error("Error parsing budget:", e);
      }
    }

    if (savedCategoryBudgets) {
      try {
        setCategoryBudgets(JSON.parse(savedCategoryBudgets));
      } catch (e) {
        console.error("Error parsing category budgets:", e);
      }
    }
    
    if (savedListViewMode) {
      try {
        setListViewMode(JSON.parse(savedListViewMode));
      } catch (e) {
        console.error("Error parsing list view mode:", e);
      }
    }
    
    if (savedFridgeItems) {
      try {
        setFridgeItems(JSON.parse(savedFridgeItems));
      } catch (e) {
        console.error("Error parsing fridge items:", e);
      }
    }
    
    if (savedRecipes) {
      try {
        setRecipes(JSON.parse(savedRecipes));
      } catch (e) {
        console.error("Error parsing recipes:", e);
      }
    }
  }, []);

  // Zapis danych do localStorage
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [items, darkMode]);

  useEffect(() => {
    localStorage.setItem('shoppingTemplates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('shoppingCategories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('shoppingStores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('shoppingStoresToVisit', JSON.stringify(storesToVisit));
  }, [storesToVisit]);

  useEffect(() => {
    localStorage.setItem('shoppingBudget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('shoppingCategoryBudgets', JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);
  
  useEffect(() => {
    localStorage.setItem('shoppingListViewMode', JSON.stringify(listViewMode));
  }, [listViewMode]);
  
  useEffect(() => {
    localStorage.setItem('shoppingFridgeItems', JSON.stringify(fridgeItems));
  }, [fridgeItems]);
  
  useEffect(() => {
    localStorage.setItem('shoppingRecipes', JSON.stringify(recipes));
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
        price: item.price || 0,     // Zachowujemy cenę
        quantity: item.quantity || 1 // Zachowujemy ilość
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
      if (updatedRecipe.ingredients && Array.isArray(updatedRecipe.ingredients)) {
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
      if (updatedRecipe.ingredients && Array.isArray(updatedRecipe.ingredients)) {
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
      if (updatedRecipe.ingredients && Array.isArray(updatedRecipe.ingredients)) {
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
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, price, quantity } 
        : item
    ));
  };

  // Obliczanie aktualnych kosztów dla listy zakupów
  const calculateTotalCost = () => {
    return items.reduce((total, item) => {
      if (!item.completed && item.price) {
        return total + (item.price * (item.quantity || 1));
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

  // Renderowanie odpowiedniego widoku
  const renderActiveView = () => {
    switch(activeView) {
      case 'shopping-list':
        return renderShoppingList();
        
      case 'fridge':
        return (
          <FridgeView
            fridgeItems={fridgeItems}
            setFridgeItems={setFridgeItems}
            categories={categories}
            darkMode={darkMode}
          />
        );
        
      case 'recipes':
        // Wyłączamy tymczasowo widok przepisów ze względu na brak biblioteki React Router
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Przepisy</h2>
            <p>Ta funkcjonalność jest obecnie niedostępna.</p>
          </div>
        );
        
      case 'templates':
        return (
          <TemplatesView
            templates={templates}
            loadTemplate={loadTemplate}
            deleteTemplate={deleteTemplate}
            darkMode={darkMode}
          />
        );
        
      case 'categories':
        return (
          <CategoriesView
            categories={categories}
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
            stores={stores}
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
            budget={budget}
            updateBudget={updateBudget}
            categoryBudgets={categoryBudgets}
            updateCategoryBudget={updateCategoryBudget}
            items={items}
            categories={categories}
            darkMode={darkMode}
          />
        );
        
      case 'menu-planner':
        return (
          <MenuPlannerView
            addItemsToShoppingList={addItemsToShoppingList}
            recipes={recipes}
            fridgeItems={fridgeItems}
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
    <Layout
      darkMode={darkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      activeView={activeView}
      setActiveView={setActiveView}
      toggleDarkMode={toggleDarkMode}
      itemsCount={items.length}
      templatesCount={templates.length}
      categoriesCount={categories.length}
      storesCount={stores.length}
      storesToVisitCount={storesToVisit.length}
      fridgeItemsCount={fridgeItems.length}
      recipesCount={recipes.length}
      showBudget={true}
      budgetAmount={budget?.total || 0}
      remainingBudget={remainingBudget}
    >
      {renderActiveView()}
    </Layout>
  );
}

export default App;