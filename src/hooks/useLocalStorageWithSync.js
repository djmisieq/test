import { useState, useEffect, useCallback } from 'react';
import useFirebaseSync from './useFirebaseSync';

/**
 * Hook do zarządzania danymi w localStorage z synchronizacją do Firebase
 * @param {string} key - Klucz do przechowywania w localStorage
 * @param {any} initialValue - Domyślna wartość jeśli brak danych w localStorage
 * @param {boolean} syncEnabled - Czy synchronizacja jest włączona
 * @returns {Array} [value, setValue, syncStatus] - Wartość, funkcja aktualizująca i status synchronizacji
 */
function useLocalStorageWithSync(key, initialValue, syncEnabled = true) {
  // Hook do synchronizacji z Firebase
  const { 
    user, 
    syncToFirebase, 
    syncFromFirebase, 
    subscribeToFirebaseChanges,
    syncStatus
  } = useFirebaseSync();

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

  // Pobierz dane z Firebase przy logowaniu
  useEffect(() => {
    if (user && syncEnabled) {
      syncFromFirebase(key).then(data => {
        if (data) {
          setValue(data);
        }
      });
    }
  }, [user, key, syncEnabled, syncFromFirebase]);

  // Subskrypcja na zmiany w Firebase
  useEffect(() => {
    if (user && syncEnabled) {
      const unsubscribe = subscribeToFirebaseChanges(key, (data) => {
        setValue(data);
      });
      
      return () => unsubscribe();
    }
  }, [user, key, syncEnabled, subscribeToFirebaseChanges]);

  // Funkcja do aktualizacji wartości z synchronizacją
  const setValueWithSync = useCallback((newValue) => {
    try {
      // Obsługa funkcji w setValue
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      
      // Aktualizacja stanu
      setValue(valueToStore);
      
      // Zapisanie do localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Synchronizacja z Firebase jeśli użytkownik jest zalogowany
      if (user && syncEnabled) {
        syncToFirebase(key, valueToStore);
      }
    } catch (error) {
      console.error(`Błąd zapisu do localStorage dla klucza "${key}":`, error);
    }
  }, [key, value, user, syncEnabled, syncToFirebase]);

  return [value, setValueWithSync, syncStatus];
}

export default useLocalStorageWithSync;