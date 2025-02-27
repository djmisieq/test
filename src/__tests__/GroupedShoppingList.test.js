import React from 'react';
import { render, screen } from '@testing-library/react';
import GroupedShoppingList from '../components/GroupedShoppingList';

describe('GroupedShoppingList Component', () => {
  const mockItems = [
    { id: 1, name: 'Mleko', category: 'Nabiał', completed: false, stores: [1] },
    { id: 2, name: 'Chleb', category: 'Pieczywo', completed: true, stores: [1, 2] },
    { id: 3, name: 'Jabłka', category: 'Owoce', completed: false } // Bez przypisanego sklepu
  ];
  
  const mockStores = [
    { id: 1, name: 'Biedronka', color: '#ff0000' },
    { id: 2, name: 'Lidl', color: '#00ff00' }
  ];
  
  const mockCallbacks = {
    toggleComplete: jest.fn(),
    deleteItem: jest.fn(),
    startEditing: jest.fn(),
    updateItemStores: jest.fn()
  };

  test('grupuje elementy według sklepów', () => {
    render(
      <GroupedShoppingList 
        items={mockItems} 
        stores={mockStores} 
        {...mockCallbacks} 
      />
    );
    
    // Sprawdź czy sklepy są wyświetlane
    expect(screen.getByText('Biedronka')).toBeInTheDocument();
    expect(screen.getByText('Lidl')).toBeInTheDocument();
    
    // Sprawdź czy elementy są w odpowiednich sklepach
    const biedronkaSection = screen.getByText('Biedronka').closest('div');
    expect(biedronkaSection).toHaveTextContent('Mleko');
    expect(biedronkaSection).toHaveTextContent('Chleb');
    
    const lidlSection = screen.getByText('Lidl').closest('div');
    expect(lidlSection).toHaveTextContent('Chleb');
    
    // Sprawdź czy nieprzypisane elementy są w sekcji "Nieprzypisane"
    expect(screen.getByText('Nieprzypisane')).toBeInTheDocument();
    const unassignedSection = screen.getByText('Nieprzypisane').closest('div');
    expect(unassignedSection).toHaveTextContent('Jabłka');
  });
});