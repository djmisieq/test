import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  setDoc, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';

/**
 * Serwis do zarządzania danymi w Firestore
 */
export const dataService = {
  /**
   * Pobiera wszystkie dokumenty z kolekcji dla użytkownika
   * @param {string} userId - ID użytkownika
   * @param {string} collectionName - Nazwa kolekcji
   * @returns {Promise<Array>} Lista dokumentów
   */
  getAllItems: async (userId, collectionName) => {
    try {
      const q = query(collection(db, collectionName), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Błąd podczas pobierania z kolekcji ${collectionName}:`, error.message);
      throw error;
    }
  },

  /**
   * Subskrypcja na zmiany w kolekcji dla użytkownika
   * @param {string} userId - ID użytkownika
   * @param {string} collectionName - Nazwa kolekcji
   * @param {Function} callback - Funkcja wywoływana przy zmianie danych
   * @returns {Function} Funkcja do anulowania subskrypcji
   */
  subscribeToCollection: (userId, collectionName, callback) => {
    try {
      const q = query(collection(db, collectionName), where('userId', '==', userId));
      return onSnapshot(q, (querySnapshot) => {
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(items);
      });
    } catch (error) {
      console.error(`Błąd podczas subskrypcji do kolekcji ${collectionName}:`, error.message);
      throw error;
    }
  },

  /**
   * Pobiera pojedynczy dokument
   * @param {string} collectionName - Nazwa kolekcji
   * @param {string} documentId - ID dokumentu
   * @returns {Promise<Object>} Dokument
   */
  getItem: async (collectionName, documentId) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Dokument nie istnieje');
      }
    } catch (error) {
      console.error(`Błąd podczas pobierania dokumentu z kolekcji ${collectionName}:`, error.message);
      throw error;
    }
  },

  /**
   * Dodaje nowy dokument do kolekcji
   * @param {string} userId - ID użytkownika
   * @param {string} collectionName - Nazwa kolekcji
   * @param {Object} data - Dane do zapisania
   * @returns {Promise<string>} ID utworzonego dokumentu
   */
  addItem: async (userId, collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Błąd podczas dodawania do kolekcji ${collectionName}:`, error.message);
      throw error;
    }
  },

  /**
   * Aktualizuje dokument w kolekcji
   * @param {string} collectionName - Nazwa kolekcji
   * @param {string} documentId - ID dokumentu
   * @param {Object} data - Dane do aktualizacji
   * @returns {Promise<void>}
   */
  updateItem: async (collectionName, documentId, data) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Błąd podczas aktualizacji w kolekcji ${collectionName}:`, error.message);
      throw error;
    }
  },

  /**
   * Usuwa dokument z kolekcji
   * @param {string} collectionName - Nazwa kolekcji
   * @param {string} documentId - ID dokumentu
   * @returns {Promise<void>}
   */
  deleteItem: async (collectionName, documentId) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Błąd podczas usuwania z kolekcji ${collectionName}:`, error.message);
      throw error;
    }
  },

  /**
   * Zapisuje lub zastępuje dokument w kolekcji
   * @param {string} userId - ID użytkownika
   * @param {string} collectionName - Nazwa kolekcji
   * @param {string} documentId - ID dokumentu
   * @param {Object} data - Dane do zapisania
   * @returns {Promise<void>}
   */
  setItem: async (userId, collectionName, documentId, data) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, {
        ...data,
        userId,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Błąd podczas ustawiania dokumentu w kolekcji ${collectionName}:`, error.message);
      throw error;
    }
  },

  /**
   * Zapisuje dane użytkownika
   * @param {string} userId - ID użytkownika
   * @param {Object} userData - Dane użytkownika
   * @returns {Promise<void>}
   */
  saveUserData: async (userId, userData) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Błąd podczas zapisywania danych użytkownika:', error.message);
      throw error;
    }
  }
};