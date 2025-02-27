import { useState, useEffect, useCallback } from 'react';
import { authService } from '../firebase/authService';
import { dataService } from '../firebase/dataService';

/**
 * Hook do synchronizacji danych między localStorage a Firebase
 * @returns {Object} Funkcje i stany do zarządzania synchronizacją
 */
function useFirebaseSync() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'synced', 'error'

  // Sprawdzenie stanu uwierzytelnienia przy montowaniu komponentu
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Synchronizacja danych z localStorage do Firebase
   * @param {string} key - Klucz localStorage
   * @param {any} data - Dane do synchronizacji
   * @returns {Promise<void>}
   */
  const syncToFirebase = useCallback(async (key, data) => {
    if (!user) return;

    try {
      setSyncStatus('syncing');
      
      // Sprawdzamy czy dane już istnieją
      const items = await dataService.getAllItems(user.uid, key);
      
      if (items.length > 0) {
        // Aktualizujemy istniejące dane
        await dataService.updateItem(key, items[0].id, { data });
      } else {
        // Tworzymy nowe dane
        await dataService.addItem(user.uid, key, { data });
      }
      
      setSyncStatus('synced');
    } catch (err) {
      console.error('Błąd synchronizacji do Firebase:', err);
      setError(err.message);
      setSyncStatus('error');
    }
  }, [user]);

  /**
   * Pobieranie danych z Firebase i zapisywanie do localStorage
   * @param {string} key - Klucz localStorage
   * @returns {Promise<any>} Pobrane dane
   */
  const syncFromFirebase = useCallback(async (key) => {
    if (!user) return null;

    try {
      setSyncStatus('syncing');
      
      const items = await dataService.getAllItems(user.uid, key);
      
      if (items.length > 0) {
        const data = items[0].data;
        localStorage.setItem(key, JSON.stringify(data));
        setSyncStatus('synced');
        return data;
      }
      
      setSyncStatus('synced');
      return null;
    } catch (err) {
      console.error('Błąd pobierania z Firebase:', err);
      setError(err.message);
      setSyncStatus('error');
      return null;
    }
  }, [user]);

  /**
   * Subskrypcja na zmiany danych w Firebase
   * @param {string} key - Klucz localStorage
   * @param {Function} callback - Funkcja wywoływana przy zmianie danych
   * @returns {Function} Funkcja do anulowania subskrypcji
   */
  const subscribeToFirebaseChanges = useCallback((key, callback) => {
    if (!user) return () => {};

    return dataService.subscribeToCollection(user.uid, key, (items) => {
      if (items.length > 0) {
        const data = items[0].data;
        localStorage.setItem(key, JSON.stringify(data));
        callback(data);
      }
    });
  }, [user]);

  /**
   * Synchronizacja wszystkich kluczy localStorage do Firebase
   * @param {Array<string>} keys - Lista kluczy do synchronizacji
   * @returns {Promise<void>}
   */
  const syncAllToFirebase = useCallback(async (keys) => {
    if (!user) return;

    try {
      setSyncStatus('syncing');
      
      for (const key of keys) {
        const dataStr = localStorage.getItem(key);
        if (dataStr) {
          const data = JSON.parse(dataStr);
          await syncToFirebase(key, data);
        }
      }
      
      setSyncStatus('synced');
    } catch (err) {
      console.error('Błąd synchronizacji wszystkich danych do Firebase:', err);
      setError(err.message);
      setSyncStatus('error');
    }
  }, [user, syncToFirebase]);

  /**
   * Pobieranie wszystkich danych z Firebase i zapisywanie do localStorage
   * @param {Array<string>} keys - Lista kluczy do pobrania
   * @returns {Promise<Object>} Pobrane dane
   */
  const syncAllFromFirebase = useCallback(async (keys) => {
    if (!user) return {};

    try {
      setSyncStatus('syncing');
      
      const result = {};
      
      for (const key of keys) {
        const data = await syncFromFirebase(key);
        if (data) {
          result[key] = data;
        }
      }
      
      setSyncStatus('synced');
      return result;
    } catch (err) {
      console.error('Błąd pobierania wszystkich danych z Firebase:', err);
      setError(err.message);
      setSyncStatus('error');
      return {};
    }
  }, [user, syncFromFirebase]);

  /**
   * Rejestracja nowego użytkownika
   * @param {string} email - Email użytkownika
   * @param {string} password - Hasło użytkownika
   * @param {string} displayName - Nazwa wyświetlana użytkownika
   * @returns {Promise<UserCredential>} Dane uwierzytelniające użytkownika
   */
  const register = useCallback(async (email, password, displayName) => {
    try {
      setLoading(true);
      const result = await authService.register(email, password, displayName);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logowanie użytkownika
   * @param {string} email - Email użytkownika
   * @param {string} password - Hasło użytkownika
   * @returns {Promise<UserCredential>} Dane uwierzytelniające użytkownika
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const result = await authService.login(email, password);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logowanie za pomocą Google
   * @returns {Promise<UserCredential>} Dane uwierzytelniające użytkownika
   */
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const result = await authService.loginWithGoogle();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Wylogowanie użytkownika
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.signOut();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Resetowanie hasła użytkownika
   * @param {string} email - Email użytkownika
   * @returns {Promise<void>}
   */
  const resetPassword = useCallback(async (email) => {
    try {
      await authService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    user,
    loading,
    error,
    syncStatus,
    syncToFirebase,
    syncFromFirebase,
    subscribeToFirebaseChanges,
    syncAllToFirebase,
    syncAllFromFirebase,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };
}

export default useFirebaseSync;