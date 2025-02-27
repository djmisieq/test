import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Komponent formularza resetowania hasła
 * @param {Object} props - Właściwości komponentu
 * @returns {JSX.Element} Komponent formularza resetowania hasła
 */
function ForgotPasswordForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword, loading } = useAuth();

  /**
   * Obsługa resetowania hasła
   * @param {Event} e - Zdarzenie formularza
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Proszę podać adres email');
      return;
    }
    
    try {
      await resetPassword(email);
      setMessage('Link do resetowania hasła został wysłany na podany adres email');
      if (onSuccess) setTimeout(onSuccess, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Resetowanie hasła</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      <form onSubmit={handleResetPassword} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Wysyłanie...' : 'Resetuj hasło'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;