import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Hook do zarządzania motywem aplikacji (jasny/ciemny)
 * @returns {Object} {darkMode, toggleDarkMode} - Stan motywu i funkcja do przełączania
 */
function useTheme() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, [setDarkMode]);

  return { darkMode, toggleDarkMode };
}

export default useTheme;