import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

/**
 * Komponent modalu uwierzytelniania
 * @param {Object} props - Właściwości komponentu
 * @returns {JSX.Element} Komponent modalu uwierzytelniania
 */
function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {activeTab === 'login' ? 'Logowanie' : activeTab === 'register' ? 'Rejestracja' : 'Resetowanie hasła'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Zamknij</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Logowanie
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Rejestracja
            </button>
          </div>
          
          {activeTab === 'login' && (
            <>
              <LoginForm onSuccess={onClose} />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveTab('forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Zapomniałeś hasła?
                </button>
              </div>
            </>
          )}
          
          {activeTab === 'register' && <RegisterForm onSuccess={onClose} />}
          
          {activeTab === 'forgot-password' && (
            <>
              <ForgotPasswordForm onSuccess={() => setActiveTab('login')} />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Powrót do logowania
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;