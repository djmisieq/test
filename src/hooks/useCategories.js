import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

// Domyślne kategorie
const DEFAULT_CATEGORIES = [
  'Warzywa i Owoce', 
  'Pieczywo', 
  'Chemia', 
  'Mięso i Wędliny', 
  'Nabiał', 
  'Sypkie', 
  'Inne'
];

/**
 * Hook do zarządzania kategoriami produktów
 * @param {Object} deps - Zależności (items, templates, etc.)
 * @returns {Object} Funkcje i dane do zarządzania kategoriami
 */
function useCategories({ items, setItems, templates, setTemplates, fridgeItems, setFridgeItems, recipes, setRecipes, categoryBudgets, setCategoryBudgets }) {
  const [categories, setCategories] = useLocalStorage('shoppingCategories', DEFAULT_CATEGORIES);

  // Dodawanie nowej kategorii
  const addCategory = useCallback((categoryName) => {
    if (categoryName.trim() === '') return;
    if (categories.includes(categoryName.trim())) return;
    
    setCategories([...categories, categoryName.trim()]);
  }, [categories, setCategories]);

  // Edycja kategorii
  const editCategory = useCallback((oldName, newName) => {
    if (newName.trim() === '' || oldName === newName) return;
    if (categories.includes(newName.trim())) return;
    
    // Aktualizujemy listę kategorii
    setCategories(categories.map(category => 
      category === oldName ? newName.trim() : category
    ));
    
    // Aktualizujemy kategorie produktów na liście
    if (setItems) {
      setItems(prevItems => prevItems.map(item => 
        item.category === oldName ? { ...item, category: newName.trim() } : item
      ));
    }
    
    // Aktualizujemy kategorie w szablonach
    if (templates && setTemplates) {
      setTemplates(templates.map(template => ({
        ...template,
        items: template.items.map(item => 
          item.category === oldName ? { ...item, category: newName.trim() } : item
        )
      })));
    }
    
    // Aktualizujemy budżety kategorii
    if (categoryBudgets && setCategoryBudgets) {
      const newBudgets = { ...categoryBudgets };
      if (newBudgets[oldName]) {
        newBudgets[newName.trim()] = newBudgets[oldName];
        delete newBudgets[oldName];
        setCategoryBudgets(newBudgets);
      }
    }
    
    // Aktualizujemy kategorie w produktach lodówki
    if (fridgeItems && setFridgeItems) {
      setFridgeItems(fridgeItems.map(item => 
        item.category === oldName ? { ...item, category: newName.trim() } : item
      ));
    }
    
    // Aktualizujemy kategorie w przepisach
    if (recipes && setRecipes) {
      setRecipes(recipes.map(recipe => {
        // Aktualizujemy kategorię przepisu
        const updatedRecipe = recipe.category === oldName ? 
          { ...recipe, category: newName.trim() } : recipe;
        
        // Aktualizujemy kategorie składników przepisu
        if (updatedRecipe.ingredients && Array.isArray(updatedRecipe.ingredients)) {
          updatedRecipe.ingredients = updatedRecipe.ingredients.map(ingredient => 
            ingredient.category === oldName ? 
              { ...ingredient, category: newName.trim() } : ingredient
          );
        }
        
        return updatedRecipe;
      }));
    }
  }, [categories, setCategories, setItems, templates, setTemplates, categoryBudgets, setCategoryBudgets, fridgeItems, setFridgeItems, recipes, setRecipes]);

  // Usuwanie kategorii
  const deleteCategory = useCallback((categoryName) => {
    // Sprawdzamy czy to nie jest ostatnia kategoria
    if (categories.length <= 1) return;
    
    // Wybieramy kategorię zastępczą (pierwsza dostępna inna niż usuwana)
    const fallbackCategory = categories.find(c => c !== categoryName) || 'Inne';
    
    // Usuwamy kategorię z listy
    setCategories(categories.filter(category => category !== categoryName));
    
    // Przenosimy produkty do kategorii zastępczej
    if (setItems) {
      setItems(prevItems => prevItems.map(item => 
        item.category === categoryName ? { ...item, category: fallbackCategory } : item
      ));
    }
    
    // Aktualizujemy kategorie w szablonach
    if (templates && setTemplates) {
      setTemplates(templates.map(template => ({
        ...template,
        items: template.items.map(item => 
          item.category === categoryName ? { ...item, category: fallbackCategory } : item
        )
      })));
    }
    
    // Aktualizujemy budżety kategorii
    if (categoryBudgets && setCategoryBudgets) {
      const newBudgets = { ...categoryBudgets };
      delete newBudgets[categoryName];
      setCategoryBudgets(newBudgets);
    }
    
    // Aktualizujemy kategorie w produktach lodówki
    if (fridgeItems && setFridgeItems) {
      setFridgeItems(fridgeItems.map(item => 
        item.category === categoryName ? { ...item, category: fallbackCategory } : item
      ));
    }
    
    // Aktualizujemy kategorie w przepisach
    if (recipes && setRecipes) {
      setRecipes(recipes.map(recipe => {
        // Aktualizujemy kategorię przepisu
        const updatedRecipe = recipe.category === categoryName ? 
          { ...recipe, category: fallbackCategory } : recipe;
        
        // Aktualizujemy kategorie składników przepisu
        if (updatedRecipe.ingredients && Array.isArray(updatedRecipe.ingredients)) {
          updatedRecipe.ingredients = updatedRecipe.ingredients.map(ingredient => 
            ingredient.category === categoryName ? 
              { ...ingredient, category: fallbackCategory } : ingredient
          );
        }
        
        return updatedRecipe;
      }));
    }
  }, [categories, setCategories, setItems, templates, setTemplates, categoryBudgets, setCategoryBudgets, fridgeItems, setFridgeItems, recipes, setRecipes]);

  // Resetowanie kategorii do domyślnych
  const resetCategories = useCallback(() => {
    // Mapujemy stare kategorie do domyślnych
    const categoryMap = {};
    categories.forEach((category, index) => {
      if (index < DEFAULT_CATEGORIES.length) {
        categoryMap[category] = DEFAULT_CATEGORIES[index];
      } else {
        categoryMap[category] = DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]; // Mapujemy nadmiarowe do "Inne"
      }
    });
    
    // Aktualizujemy kategorie produktów
    if (setItems) {
      setItems(prevItems => prevItems.map(item => ({
        ...item,
        category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
      })));
    }
    
    // Aktualizujemy kategorie w szablonach
    if (templates && setTemplates) {
      setTemplates(templates.map(template => ({
        ...template,
        items: template.items.map(item => ({
          ...item,
          category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
        }))
      })));
    }
    
    // Aktualizujemy budżety kategorii
    if (categoryBudgets && setCategoryBudgets) {
      const newBudgets = {};
      Object.entries(categoryBudgets).forEach(([category, value]) => {
        if (categoryMap[category]) {
          newBudgets[categoryMap[category]] = value;
        }
      });
      setCategoryBudgets(newBudgets);
    }
    
    // Aktualizujemy kategorie w produktach lodówki
    if (fridgeItems && setFridgeItems) {
      setFridgeItems(fridgeItems.map(item => ({
        ...item,
        category: categoryMap[item.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
      })));
    }
    
    // Aktualizujemy kategorie w przepisach
    if (recipes && setRecipes) {
      setRecipes(recipes.map(recipe => {
        // Aktualizujemy kategorię przepisu
        const updatedRecipe = {
          ...recipe,
          category: categoryMap[recipe.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
        };
        
        // Aktualizujemy kategorie składników przepisu
        if (updatedRecipe.ingredients && Array.isArray(updatedRecipe.ingredients)) {
          updatedRecipe.ingredients = updatedRecipe.ingredients.map(ingredient => ({
            ...ingredient,
            category: categoryMap[ingredient.category] || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
          }));
        }
        
        return updatedRecipe;
      }));
    }
    
    // Przywracamy domyślne kategorie
    setCategories([...DEFAULT_CATEGORIES]);
  }, [categories, setCategories, setItems, templates, setTemplates, categoryBudgets, setCategoryBudgets, fridgeItems, setFridgeItems, recipes, setRecipes]);

  return {
    categories,
    setCategories,
    addCategory,
    editCategory,
    deleteCategory,
    resetCategories,
    DEFAULT_CATEGORIES
  };
}

export default useCategories;