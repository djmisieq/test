import { useState, useEffect } from 'react';

/**
 * Hook do zarządzania danymi w localStorage
 * @param {string} key - Klucz do przechowywania w localStorage
 * @param {any} initialValue - Domyślna wartość jeśli brak danych w localStorage
 * @returns {Array} [value, setValue] - Wartość z localStorage i funkcja do jej aktualizacji
 */
function useLocalStorage(key, initialValue) {
  // Funkcja do pobrania wartości z localStorage
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Błąd odczytu z localStorage dla klucza "${key}":`, error);
      return initialValue;
    }
  };

  // Stan do przechowywania wartości
  const [value, setValue] = useState(getStoredValue);

  // Aktualizacja localStorage gdy wartość się zmienia
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Błąd zapisu do localStorage dla klucza "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;