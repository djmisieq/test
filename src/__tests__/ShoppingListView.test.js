import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShoppingListView from '../components/ShoppingListView';

// Mock dla props
const mockProps = {
  items: [
    { id: 1, name: 'Mleko', category: 'Nabiał', completed: false },
    { id: 2, name: 'Chleb', category: 'Pieczywo', completed: true }
  ],
  setItems: jest.fn(),
  categories: ['Nabiał', 'Pieczywo', 'Inne'],
  newItem: '',
  setNewItem: jest.fn(),
  newItemCategory: 'Nabiał',
  setNewItemCategory: jest.fn(),
  filterCategory: 'Wszystkie',
  setFilterCategory: jest.fn(),
  // Inne wymagane props...
  darkMode: false,
  listViewMode: 'standard',
  toggleListViewMode: jest.fn()
};

describe('ShoppingListView Component', () => {
  test('renderuje listę zakupów z elementami', () => {
    render(<ShoppingListView {...mockProps} />);
    
    // Sprawdź czy elementy są wyświetlane
    expect(screen.getByText('Mleko')).toBeInTheDocument();
    expect(screen.getByText('Chleb')).toBeInTheDocument();
  });

  test('oznaczanie elementu jako zakończonego wywołuje setItems', () => {
    render(<ShoppingListView {...mockProps} />);
    
    // Znajdź checkbox dla "Mleko" i kliknij go
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    
    // Sprawdź czy setItems został wywołany
    expect(mockProps.setItems).toHaveBeenCalled();
  });
});