import React, { createContext, useContext } from 'react';
import useItems from '../hooks/useItems';
import useCategories from '../hooks/useCategories';
import useTheme from '../hooks/useTheme';
import useLocalStorage from '../hooks/useLocalStorage';

// Tworzymy kontekst
const AppContext = createContext(null);

/**
 * Provider kontekstu aplikacji, zawierający wszystkie globalne stany
 * @param {Object} props - Właściwości komponentu
 * @returns {JSX.Element} Provider z kontekstem aplikacji
 */
export const AppProvider = ({ children }) => {
  // Stan UI
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebarOpen', false);
  const [activeView, setActiveView] = useLocalStorage('activeView', 'shopping-list');
  const [listViewMode, setListViewMode] = useLocalStorage('shoppingListViewMode', 'standard');
  
  // Stan formularzy i edycji
  const [newItem, setNewItem] = React.useState('');
  const [newItemCategory, setNewItemCategory] = React.useState('');
  const [editingItem, setEditingItem] = React.useState(null);
  const [editItemName, setEditItemName] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('Wszystkie');
  const [filterStore, setFilterStore] = React.useState('all');
  const [newTemplateName, setNewTemplateName] = React.useState('');
  const [saveTemplateModalOpen, setSaveTemplateModalOpen] = React.useState(false);
  
  // Główne stany aplikacji
  const [templates, setTemplates] = useLocalStorage('shoppingTemplates', []);
  const [stores, setStores] = useLocalStorage('shoppingStores', []);
  const [storesToVisit, setStoresToVisit] = useLocalStorage('shoppingStoresToVisit', []);
  const [budget, setBudget] = useLocalStorage('shoppingBudget', { total: 0 });
  const [categoryBudgets, setCategoryBudgets] = useLocalStorage('shoppingCategoryBudgets', {});
  const [fridgeItems, setFridgeItems] = useLocalStorage('shoppingFridgeItems', []);
  const [recipes, setRecipes] = useLocalStorage('shoppingRecipes', []);
  
  // Funkcje zarządzające elementami listy
  const itemsManager = useItems();
  const { items, setItems, addItem, updateItem, deleteItem, toggleComplete, 
          updateItemStores, updateItemPrice, addItems, calculateTotalCost } = itemsManager;
  
  // Funkcje zarządzające kategoriami
  const categoriesManager = useCategories({
    items, setItems, templates, setTemplates, fridgeItems, 
    setFridgeItems, recipes, setRecipes, categoryBudgets, setCategoryBudgets
  });
  const { categories, addCategory, editCategory, deleteCategory, resetCategories } = categoriesManager;
  
  // Ustaw domyślną kategorię, gdy kategorie zostaną załadowane
  React.useEffect(() => {
    if (categories.length > 0 && !newItemCategory) {
      setNewItemCategory(categories[0]);
    }
  }, [categories, newItemCategory]);
  
  // Funkcje UI
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const toggleListViewMode = () => {
    setListViewMode(listViewMode === 'standard' ? 'grouped' : 'standard');
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
  
  // Obliczanie aktualnych kosztów i budżetu
  const totalCost = calculateTotalCost();
  const totalBudget = budget?.total || 0;
  const remainingBudget = totalBudget - totalCost;
  
  // Funkcje zarządzania przepisami
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
  
  const deleteRecipe = (recipeId) => {
    setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
  };
  
  // Wszystkie wartości i funkcje, które chcemy udostępnić w kontekście
  const contextValue = {
    // Stan UI
    darkMode,
    toggleDarkMode,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    activeView,
    setActiveView,
    listViewMode,
    setListViewMode,
    toggleListViewMode,
    
    // Stan formularzy i edycji
    newItem,
    setNewItem,
    newItemCategory,
    setNewItemCategory,
    editingItem,
    setEditingItem,
    editItemName,
    setEditItemName,
    filterCategory,
    setFilterCategory,
    filterStore,
    setFilterStore,
    newTemplateName,
    setNewTemplateName,
    saveTemplateModalOpen,
    setSaveTemplateModalOpen,
    
    // Główne stany aplikacji
    items,
    setItems,
    addItem,
    updateItem,
    deleteItem,
    toggleComplete,
    updateItemStores,
    updateItemPrice,
    addItems,
    calculateTotalCost,
    
    categories,
    addCategory,
    editCategory,
    deleteCategory,
    resetCategories,
    
    templates,
    setTemplates,
    saveAsTemplate,
    loadTemplate,
    deleteTemplate,
    
    stores,
    setStores,
    addStore,
    editStore,
    deleteStore,
    storesToVisit,
    setStoresToVisit,
    setStoreToVisit,
    calculateOptimalRoute,
    
    budget,
    updateBudget,
    categoryBudgets,
    updateCategoryBudget,
    totalCost,
    totalBudget,
    remainingBudget,
    
    fridgeItems,
    setFridgeItems,
    
    recipes,
    setRecipes,
    saveRecipe,
    deleteRecipe
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Hook do korzystania z kontekstu aplikacji
 * @returns {Object} Kontekst aplikacji
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};