import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ShoppingListView from './components/ShoppingListView';
import TemplatesView from './components/TemplatesView';
import CategoriesView from './components/CategoriesView';
import SettingsView from './components/SettingsView';
import StoresView from './components/StoresView';

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
  
  // Stany UI
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('shopping-list');
  
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

  // Funkcje UI
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Funkcje zarządzania szablonami
  const saveAsTemplate = () => {
    if (newTemplateName.trim() === '') return;
    
    // Filtrujemy tylko niezakończone elementy do szablonu i usuwamy pole completed
    const templateItems = items
      .filter(item => !item.completed)
      .map(({ id, name, category, stores }) => ({
        id: Date.now() + Math.random(), // Generujemy nowe ID dla szablonu
        name,
        category,
        stores: stores || [] // Zachowujemy przypisane sklepy
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
        stores: item.stores || [] // Zachowujemy przypisane sklepy
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
    
    // Aktualizujemy filtr kategorii jeśli trzeba
    if (filterCategory === categoryName) {
      setFilterCategory('Wszystkie');
    }
    
    // Aktualizujemy kategorię nowego przedmiotu jeśli trzeba
    if (newItemCategory === categoryName) {
      setNewItemCategory(fallbackCategory);
    }
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

  // Renderowanie odpowiedniego widoku
  const renderActiveView = () => {
    switch(activeView) {
      case 'shopping-list':
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
            darkMode={darkMode}
          />
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
    >
      {renderActiveView()}
    </Layout>
  );
}

export default App;