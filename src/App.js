import React from 'react';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/MainLayout';

/**
 * Główny komponent aplikacji, który opakowuje całą aplikację w kontekst
 * @returns {JSX.Element} Aplikacja z kontekstem
 */
function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;