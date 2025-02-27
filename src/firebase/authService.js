import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './config';

/**
 * Serwis do zarządzania uwierzytelnianiem użytkowników w Firebase
 */
export const authService = {
  /**
   * Rejestracja nowego użytkownika
   * @param {string} email - Email użytkownika
   * @param {string} password - Hasło użytkownika
   * @param {string} displayName - Nazwa wyświetlana użytkownika
   * @returns {Promise<UserCredential>} Dane uwierzytelniające użytkownika
   */
  register: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      return userCredential;
    } catch (error) {
      console.error('Błąd podczas rejestracji:', error.message);
      throw error;
    }
  },

  /**
   * Logowanie użytkownika
   * @param {string} email - Email użytkownika
   * @param {string} password - Hasło użytkownika
   * @returns {Promise<UserCredential>} Dane uwierzytelniające użytkownika
   */
  login: async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Błąd podczas logowania:', error.message);
      throw error;
    }
  },

  /**
   * Logowanie za pomocą Google
   * @returns {Promise<UserCredential>} Dane uwierzytelniające użytkownika
   */
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Błąd podczas logowania z Google:', error.message);
      throw error;
    }
  },

  /**
   * Wylogowanie użytkownika
   * @returns {Promise<void>}
   */
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Błąd podczas wylogowania:', error.message);
      throw error;
    }
  },

  /**
   * Resetowanie hasła użytkownika
   * @param {string} email - Email użytkownika
   * @returns {Promise<void>}
   */
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Błąd podczas resetowania hasła:', error.message);
      throw error;
    }
  },

  /**
   * Subskrypcja na zmiany stanu uwierzytelnienia
   * @param {Function} callback - Funkcja wywoływana przy zmianie stanu uwierzytelnienia
   * @returns {Function} Funkcja do anulowania subskrypcji
   */
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Aktualnie zalogowany użytkownik
   * @returns {User|null} Obiekt użytkownika lub null
   */
  getCurrentUser: () => {
    return auth.currentUser;
  }
};