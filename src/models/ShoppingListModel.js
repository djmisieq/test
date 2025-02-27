// src/models/ShoppingListModel.js
// Model zarządzający danymi listy zakupów

class ShoppingListModel {
  constructor() {
    this.items = [];
    this.categories = [
      'Warzywa i Owoce', 
      'Pieczywo', 
      'Chemia', 
      'Mięso i Wędliny', 
      'Nabiał', 
      'Sypkie', 
      'Inne'
    ];
    this.templates = [];
    this.stores = [];
    this.storesToVisit = [];
    this.budget = { total: 0 };
    this.categoryBudgets = {};
    this.darkMode = false;
    
    this.listeners = [];
    
    // Ładowanie danych z localStorage
    this.loadFromStorage();
  }
  
  // Metoda do ładowania danych z localStorage
  loadFromStorage() {
    const savedItems = localStorage.getItem('shoppingList');
    const savedTemplates = localStorage.getItem('shoppingTemplates');
    const savedCategories = localStorage.getItem('shoppingCategories');
    const savedStores = localStorage.getItem('shoppingStores');
    const savedStoresToVisit = localStorage.getItem('shoppingStoresToVisit');
    const savedBudget = localStorage.getItem('shoppingBudget');
    const savedCategoryBudgets = localStorage.getItem('shoppingCategoryBudgets');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedItems) this.items = JSON.parse(savedItems);
    if (savedTemplates) this.templates = JSON.parse(savedTemplates);
    if (savedCategories) this.categories = JSON.parse(savedCategories);
    if (savedStores) this.stores = JSON.parse(savedStores);
    if (savedStoresToVisit) this.storesToVisit = JSON.parse(savedStoresToVisit);
    if (savedBudget) this.budget = JSON.parse(savedBudget);
    if (savedCategoryBudgets) this.categoryBudgets = JSON.parse(savedCategoryBudgets);
    if (savedDarkMode) this.darkMode = JSON.parse(savedDarkMode);
  }
  
  // Metoda do zapisu danych w localStorage
  saveToStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(this.items));
    localStorage.setItem('shoppingTemplates', JSON.stringify(this.templates));
    localStorage.setItem('shoppingCategories', JSON.stringify(this.categories));
    localStorage.setItem('shoppingStores', JSON.stringify(this.stores));
    localStorage.setItem('shoppingStoresToVisit', JSON.stringify(this.storesToVisit));
    localStorage.setItem('shoppingBudget', JSON.stringify(this.budget));
    localStorage.setItem('shoppingCategoryBudgets', JSON.stringify(this.categoryBudgets));
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
  }
  
  // Dodawanie przedmiotu
  addItem(name, category) {
    if (!name.trim()) return false;
    
    const newItem = {
      id: Date.now(),
      name: name.trim(),
      category: category || this.categories[0],
      completed: false,
      stores: [],
      price: 0,
      quantity: 1
    };
    
    this.items.push(newItem);
    this.saveToStorage();
    this.notifyListeners();
    return newItem;
  }
  
  // Aktualizacja przedmiotu
  updateItem(itemId, data) {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index === -1) return false;
    
    this.items[index] = { ...this.items[index], ...data };
    this.saveToStorage();
    this.notifyListeners();
    return this.items[index];
  }
  
  // Usuwanie przedmiotu
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }
  
  // Oznaczanie przedmiotu jako kupiony
  toggleItemComplete(itemId) {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index === -1) return false;
    
    this.items[index].completed = !this.items[index].completed;
    this.saveToStorage();
    this.notifyListeners();
    return this.items[index];
  }
  
  // Dodawanie kategorii
  addCategory(name) {
    if (!name.trim() || this.categories.includes(name.trim())) return false;
    
    this.categories.push(name.trim());
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }
  
  // Edycja nazwy kategorii
  updateCategory(oldName, newName) {
    if (!newName.trim() || oldName === newName || this.categories.includes(newName.trim())) return false;
    
    // Aktualizuj nazwę kategorii
    const index = this.categories.findIndex(cat => cat === oldName);
    if (index === -1) return false;
    
    this.categories[index] = newName.trim();
    
    // Aktualizuj przedmioty z tą kategorią
    this.items = this.items.map(item => 
      item.category === oldName ? { ...item, category: newName.trim() } : item
    );
    
    // Aktualizuj szablony
    this.templates = this.templates.map(template => ({
      ...template,
      items: template.items.map(item => 
        item.category === oldName ? { ...item, category: newName.trim() } : item
      )
    }));
    
    // Aktualizuj budżety kategorii
    if (this.categoryBudgets[oldName]) {
      this.categoryBudgets[newName.trim()] = this.categoryBudgets[oldName];
      delete this.categoryBudgets[oldName];
    }
    
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }
  
  // Usuwanie kategorii
  removeCategory(name) {
    if (this.categories.length <= 1) return false;
    
    // Znajdź kategorię zastępczą
    const fallbackCategory = this.categories.find(c => c !== name) || 'Inne';
    
    // Usuń kategorię
    this.categories = this.categories.filter(c => c !== name);
    
    // Aktualizuj przedmioty z tą kategorią
    this.items = this.items.map(item => 
      item.category === name ? { ...item, category: fallbackCategory } : item
    );
    
    // Aktualizuj szablony
    this.templates = this.templates.map(template => ({
      ...template,
      items: template.items.map(item => 
        item.category === name ? { ...item, category: fallbackCategory } : item
      )
    }));
    
    // Usuń budżet kategorii
    if (this.categoryBudgets[name]) {
      delete this.categoryBudgets[name];
    }
    
    this.saveToStorage();
    this.notifyListeners();
    return fallbackCategory;
  }
  
  // Tworzenie szablonu
  createTemplate(name, itemIds = []) {
    if (!name.trim()) return false;
    
    let templateItems = [];
    
    if (itemIds.length > 0) {
      // Użyj tylko określonych przedmiotów
      templateItems = itemIds.map(id => {
        const item = this.items.find(i => i.id === id);
        if (!item) return null;
        
        return {
          id: Date.now() + Math.random(),
          name: item.name,
          category: item.category,
          stores: item.stores || [],
          price: item.price || 0,
          quantity: item.quantity || 1
        };
      }).filter(Boolean);
    } else {
      // Użyj wszystkich niezakończonych przedmiotów
      templateItems = this.items
        .filter(item => !item.completed)
        .map(({ name, category, stores, price, quantity }) => ({
          id: Date.now() + Math.random(),
          name,
          category,
          stores: stores || [],
          price: price || 0,
          quantity: quantity || 1
        }));
    }
    
    if (templateItems.length === 0) return false;
    
    const newTemplate = {
      id: Date.now(),
      name: name.trim(),
      items: templateItems
    };
    
    this.templates.push(newTemplate);
    this.saveToStorage();
    this.notifyListeners();
    return newTemplate;
  }
  
  // Wczytanie szablonu
  loadTemplate(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return false;
    
    // Dodaj tylko elementy, których jeszcze nie ma na liście
    const existingNames = new Set(this.items.map(item => item.name.toLowerCase()));
    
    const newItems = template.items
      .filter(item => !existingNames.has(item.name.toLowerCase()))
      .map(item => ({
        ...item,
        id: Date.now() + Math.random(),
        completed: false
      }));
    
    if (newItems.length === 0) return false;
    
    this.items = [...this.items, ...newItems];
    this.saveToStorage();
    this.notifyListeners();
    return newItems;
  }
  
  // Usuwanie szablonu
  removeTemplate(templateId) {
    this.templates = this.templates.filter(t => t.id !== templateId);
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }
  
  // Dodawanie sklepu
  addStore(storeData) {
    if (!storeData.name || !storeData.name.trim()) return false;
    
    const newStore = {
      id: Date.now(),
      ...storeData,
      name: storeData.name.trim()
    };
    
    this.stores.push(newStore);
    this.saveToStorage();
    this.notifyListeners();
    return newStore;
  }
  
  // Aktualizacja sklepu
  updateStore(storeId, storeData) {
    const index = this.stores.findIndex(store => store.id === storeId);
    if (index === -1) return false;
    
    this.stores[index] = { ...this.stores[index], ...storeData };
    
    if (storeData.name) {
      this.stores[index].name = storeData.name.trim();
    }
    
    this.saveToStorage();
    this.notifyListeners();
    return this.stores[index];
  }
  
  // Usuwanie sklepu
  removeStore(storeId) {
    // Usuwamy sklep z listy
    this.stores = this.stores.filter(store => store.id !== storeId);
    
    // Usuwamy referencje do sklepu z produktów
    this.items = this.items.map(item => ({
      ...item,
      stores: item.stores 
        ? item.stores.filter(id => id !== storeId)
        : []
    }));
    
    // Usuwamy referencje do sklepu z szablonów
    this.templates = this.templates.map(template => ({
      ...template,
      items: template.items.map(item => ({
        ...item,
        stores: item.stores 
          ? item.stores.filter(id => id !== storeId)
          : []
      }))
    }));
    
    // Usuwamy sklep z listy do odwiedzenia
    this.storesToVisit = this.storesToVisit.filter(id => id !== storeId);
    
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }
  
  // Dodawanie/usuwanie sklepu do odwiedzenia
  toggleStoreToVisit(storeId, shouldVisit) {
    if (shouldVisit) {
      if (!this.storesToVisit.includes(storeId)) {
        this.storesToVisit.push(storeId);
      }
    } else {
      this.storesToVisit = this.storesToVisit.filter(id => id !== storeId);
    }
    
    this.saveToStorage();
    this.notifyListeners();
    return this.storesToVisit;
  }
  
  // Aktualizacja sklepów dla przedmiotu
  updateItemStores(itemId, storeIds) {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index === -1) return false;
    
    this.items[index].stores = storeIds;
    this.saveToStorage();
    this.notifyListeners();
    return this.items[index];
  }
  
  // Aktualizacja ceny przedmiotu
  updateItemPrice(itemId, price, quantity = 1) {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index === -1) return false;
    
    this.items[index].price = price;
    this.items[index].quantity = quantity;
    this.saveToStorage();
    this.notifyListeners();
    return this.items[index];
  }
  
  // Aktualizacja budżetu
  updateBudget(budgetData) {
    this.budget = { ...this.budget, ...budgetData };
    this.saveToStorage();
    this.notifyListeners();
    return this.budget;
  }
  
  // Aktualizacja budżetu kategorii
  updateCategoryBudget(category, amount) {
    this.categoryBudgets = {
      ...this.categoryBudgets,
      [category]: amount
    };
    this.saveToStorage();
    this.notifyListeners();
    return this.categoryBudgets;
  }
  
  // Przełączanie trybu ciemnego
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.saveToStorage();
    this.notifyListeners();
    return this.darkMode;
  }
  
  // Obliczanie sumy kosztów
  calculateTotalCost() {
    return this.items.reduce((total, item) => {
      if (!item.completed && item.price) {
        return total + (item.price * (item.quantity || 1));
      }
      return total;
    }, 0);
  }
  
  // Obliczanie pozostałego budżetu
  calculateRemainingBudget() {
    const totalCost = this.calculateTotalCost();
    const totalBudget = this.budget?.total || 0;
    return totalBudget - totalCost;
  }
  
  // System obserwatorów (observers)
  addListener(listener) {
    this.listeners.push(listener);
    return () => this.removeListener(listener);
  }
  
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
  
  notifyListeners() {
    this.listeners.forEach(listener => listener(this));
  }
  
  // Metoda do resetowania kategorii do domyślnych
  resetCategories() {
    const DEFAULT_CATEGORIES = [
      'Warzywa i Owoce', 
      'Pieczywo', 
      'Chemia', 
      'Mięso i Wędliny', 
      'Nabiał', 
      'Sypkie', 
      'Inne'
    ];
    
    // Mapujemy stare kategorie do domyślnych
    const categoryMap = {};
    this.categories.forEach((category, index) => {
      if (index < DEFAULT_CATEGORIES.length) {
        categoryMap[category] = DEFAULT_CATEGORIES[index];
      } else {
        categoryMap[category] = DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]; // Mapujemy nadmiarowe do "Inne"
      }
    });
    
    // Aktualizujemy kategorie produktów
    this.items = this.items.map(item => ({
      ...item,
      category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
    }));
    
    // Aktualizujemy kategorie w szablonach
    this.templates = this.templates.map(template => ({
      ...template,
      items: template.items.map(item => ({
        ...item,
        category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
      }))
    }));
    
    // Aktualizujemy budżety kategorii
    const newBudgets = {};
    Object.entries(this.categoryBudgets).forEach(([category, value]) => {
      if (categoryMap[category]) {
        newBudgets[categoryMap[category]] = value;
      }
    });
    this.categoryBudgets = newBudgets;
    
    // Przywracamy domyślne kategorie
    this.categories = [...DEFAULT_CATEGORIES];
    
    this.saveToStorage();
    this.notifyListeners();
    return DEFAULT_CATEGORIES[0];
  }
}

export default ShoppingListModel;