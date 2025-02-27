import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Komponent formularza logowania
 * @param {Object} props - Właściwości komponentu
 * @returns {JSX.Element} Komponent formularza logowania
 */
function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle, loading } = useAuth();

  /**
   * Obsługa logowania
   * @param {Event} e - Zdarzenie formularza
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Proszę wypełnić wszystkie pola');
      return;
    }
    
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Obsługa logowania przez Google
   */
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Logowanie</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasło
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Lub kontynuuj z
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M12.545 12.151L12.545 12.151L12.545 12.151C12.545 9.684 14.546 7.674 17.004 7.674C18.199 7.674 19.313 8.128 20.144 8.957L20.144 8.957L23.078 6.022C21.234 4.323 19.184 3.5 17.004 3.5C12.136 3.5 8.004 7.632 8.004 12.5C8.004 17.367 12.136 21.5 17.004 21.5C21.619 21.5 25.548 17.958 25.548 12.5C25.548 11.795 25.548 11.212 25.352 10.516H17.004V14.688H21.731C21.257 16.364 19.395 18.306 17.004 18.306C14.546 18.306 12.545 16.296 12.545 13.828C12.545 13.815 12.545 13.802 12.545 13.79C12.545 13.777 12.545 13.764 12.545 13.751L12.545 12.151Z"
                fill="#4285F4"
              />
              <path
                d="M3.5 7.619V10.815H7.493C7.323 11.544 6.677 12.796 5.058 12.796C3.155 12.796 1.602 11.212 1.602 9.309C1.602 7.406 3.155 5.823 5.058 5.823C6.097 5.823 6.807 6.236 7.229 6.638L9.628 4.323C8.628 3.385 7.018 2.75 5.058 2.75C1.442 2.75 0 6.071 0 9.309C0 12.546 1.442 15.867 5.058 15.867C8.505 15.867 10.616 13.593 10.616 9.389C10.616 8.902 10.566 8.505 10.487 8.098L3.5 8.098V7.619Z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;