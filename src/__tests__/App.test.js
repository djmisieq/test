import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

// Mock dla localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App Component', () => {
  beforeEach(() => {
    // Domyślne wartości dla localStorage
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'shoppingList') return JSON.stringify([]);
      if (key === 'darkMode') return JSON.stringify(false);
      if (key === 'shoppingTemplates') return JSON.stringify([]);
      if (key === 'shoppingCategories') return JSON.stringify(['Warzywa i Owoce', 'Pieczywo', 'Inne']);
      return null;
    });
  });

  test('renderuje główny układ aplikacji', () => {
    render(<App />);
    expect(screen.getByText('Lista Zakupów')).toBeInTheDocument();
  });

  test('dodaje nowy element do listy zakupów', () => {
    render(<App />);
    
    // Znajdź pole wprowadzania i przycisk dodawania
    const input = screen.getByPlaceholderText('Dodaj nowy produkt...');
    const addButton = screen.getByText('Dodaj');
    
    // Wprowadź nazwę produktu i kliknij przycisk
    fireEvent.change(input, { target: { value: 'Marchewki' } });
    fireEvent.click(addButton);
    
    // Sprawdź czy produkt został dodany
    expect(screen.getByText('Marchewki')).toBeInTheDocument();
    
    // Sprawdź czy localStorage.setItem został wywołany
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});