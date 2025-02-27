import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from './AuthModal';

/**
 * Komponent menu użytkownika
 * @returns {JSX.Element} Komponent menu użytkownika
 */
function UserMenu() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  /**
   * Obsługa wylogowania
   */
  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Błąd podczas wylogowania:', error);
    }
  };

  return (
    <>
      <div className="relative">
        {user ? (
          <div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 dark:bg-gray-700 dark:text-white">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Użytkownik'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                )}
              </div>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-medium">{user.displayName || 'Użytkownik'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Wyloguj się
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Zaloguj się
          </button>
        )}
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

export default UserMenu;