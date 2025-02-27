import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Konfiguracja Firebase.
 * Uwaga: W produkcyjnej aplikacji te wartości powinny być przechowywane w zmiennych środowiskowych.
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "shopping-list-app-xxxxx.firebaseapp.com",
  projectId: "shopping-list-app-xxxxx",
  storageBucket: "shopping-list-app-xxxxx.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxx"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };