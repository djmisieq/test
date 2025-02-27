import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../firebase/authService';
import { dataService } from '../firebase/dataService';

// Tworzymy kontekst uwierzytelniania
const AuthContext = createContext(null);

/**
 * Provider kontekstu uwierzytelniania, zawierający stan i funkcje uwierzytelniania
 * @param {Object} props - Właściwości komponentu
 * @returns {JSX.Element} Provider z kontekstem uwierzytelniania
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sprawdzenie stanu uwierzytelnienia przy montowaniu komponentu
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Rejestracja nowego użytkownika
   * @param {string} email - Email użytkownika
   * @param {string} password - Hasło użytkownika
   * @param {string} displayName - Nazwa wyświetlana użytkownika
   * @returns {Promise<UserCredential>} Dane uwierzytelniające użytkownika
   */
  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.register(email, password, displayName);
      
      // Inicjalizacja danych użytkownika
      await dataService.saveUserData(result.user.uid, {
        email,
        displayName,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logowanie użytkownika
   * @param {string} email - Email użytkownika
   * @param {string} password - Hasło użytkownika
   * @returns {Promise<UserCredential>} Dane uwierzytelniające użytkownika
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.login(email, password);
      
      // Aktualizacja ostatniego logowania
      if (result.user) {
        await dataService.saveUserData(result.user.uid, {
          lastLogin: new Date().toISOString()
        });
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logowanie za pomocą Google
   * @returns {Promise<UserCredential>} Dane uwierzytelniające użytkownika
   */
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.loginWithGoogle();
      
      // Aktualizacja lub inicjalizacja danych użytkownika
      if (result.user) {
        await dataService.saveUserData(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          lastLogin: new Date().toISOString()
        });
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Wylogowanie użytkownika
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetowanie hasła użytkownika
   * @param {string} email - Email użytkownika
   * @returns {Promise<void>}
   */
  const resetPassword = async (email) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Wartość kontekstu
  const value = {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook do korzystania z kontekstu uwierzytelniania
 * @returns {Object} Kontekst uwierzytelniania
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};