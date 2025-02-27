import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Hook do zarządzania elementami listy zakupów
 * @returns {Object} Funkcje i dane do zarządzania listą zakupów
 */
function useItems() {
  const [items, setItems] = useLocalStorage('shoppingList', []);

  // Dodawanie nowego elementu
  const addItem = useCallback((name, category) => {
    if (!name.trim()) return;
    
    const newItem = {
      id: Date.now(),
      name: name.trim(),
      category,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setItems(prevItems => [...prevItems, newItem]);
    return newItem;
  }, [setItems]);

  // Aktualizacja elementu
  const updateItem = useCallback((itemId, updates) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  }, [setItems]);

  // Usuwanie elementu
  const deleteItem = useCallback((itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, [setItems]);

  // Oznaczanie elementu jako zakończony/niezakończony
  const toggleComplete = useCallback((itemId) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  }, [setItems]);

  // Aktualizacja sklepów dla elementu
  const updateItemStores = useCallback((itemId, storeIds) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, stores: storeIds } : item
      )
    );
  }, [setItems]);

  // Aktualizacja ceny i ilości elementu
  const updateItemPrice = useCallback((itemId, price, quantity) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, price, quantity } : item
      )
    );
  }, [setItems]);

  // Dodawanie wielu elementów na raz
  const addItems = useCallback((newItems) => {
    if (!Array.isArray(newItems) || newItems.length === 0) return;
    
    const existingNames = new Set(items.map(item => item.name.toLowerCase()));
    
    const uniqueNewItems = newItems.filter(item => 
      !existingNames.has(item.name.toLowerCase())
    ).map(item => ({
      ...item,
      id: Date.now() + Math.random(),
      completed: false
    }));
    
    if (uniqueNewItems.length > 0) {
      setItems(prevItems => [...prevItems, ...uniqueNewItems]);
    }
    
    return uniqueNewItems;
  }, [items, setItems]);

  // Obliczanie kosztów
  const calculateTotalCost = useCallback(() => {
    return items.reduce((total, item) => {
      if (!item.completed && item.price) {
        return total + (item.price * (item.quantity || 1));
      }
      return total;
    }, 0);
  }, [items]);

  return {
    items,
    setItems,
    addItem,
    updateItem,
    deleteItem,
    toggleComplete,
    updateItemStores,
    updateItemPrice,
    addItems,
    calculateTotalCost
  };
}

export default useItems;