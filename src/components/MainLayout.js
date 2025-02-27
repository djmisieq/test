import React from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from './Layout';
import ShoppingListView from './ShoppingListView';
import GroupedShoppingList from './GroupedShoppingList';
import TemplatesView from './TemplatesView';
import CategoriesView from './CategoriesView';
import StoresView from './StoresView';
import BudgetView from './BudgetView';
import MenuPlannerView from './MenuPlannerView';
import FridgeView from './FridgeView';
import SettingsView from './SettingsView';

/**
 * Główny układ aplikacji, który renderuje odpowiedni widok na podstawie activeView
 * @returns {JSX.Element} Układ aplikacji z odpowiednim widokiem
 */
function MainLayout() {
  const { 
    // Stan UI
    darkMode, toggleDarkMode, sidebarOpen, toggleSidebar, activeView, 
    listViewMode, toggleListViewMode,
    
    // Dane o elementach
    items, toggleComplete, deleteItem, setItems,
    
    // Dane o kategoriach
    categories,
    
    // Dane o szablonach
    templates, loadTemplate, deleteTemplate,
    
    // Dane o sklepach
    stores, storesToVisit, updateItemStores,
    
    // Dane o budżecie
    budget, totalBudget, remainingBudget,
    
    // Dane o lodówce
    fridgeItems, setFridgeItems,
    
    // Dane o przepisach
    recipes,
    
    // Pozostałe stany i funkcje
    newItem, setNewItem, newItemCategory, setNewItemCategory,
    editingItem, setEditingItem, editItemName, setEditItemName,
    filterCategory, setFilterCategory, filterStore, setFilterStore,
    saveTemplateModalOpen, setSaveTemplateModalOpen, newTemplateName, 
    setNewTemplateName, saveAsTemplate, addItems, updateItemPrice,
    addStore, editStore, deleteStore, setStoreToVisit, calculateOptimalRoute,
    updateBudget, categoryBudgets, updateCategoryBudget,
    addCategory, editCategory, deleteCategory, resetCategories
  } = useAppContext();
  
  // Renderowanie komponentu listy zakupów
  const renderShoppingList = () => {
    if (listViewMode === 'grouped') {
      return (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lista Zakupów - Wg Sklepów</h2>
            <button 
              onClick={toggleListViewMode}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Widok Standardowy
            </button>
          </div>
          <GroupedShoppingList 
            items={items.filter(item => {
              // Filtrowanie według kategorii
              if (filterCategory !== 'Wszystkie' && item.category !== filterCategory) {
                return false;
              }
              // Filtrowanie według sklepu
              if (filterStore !== 'all') {
                return item.stores && item.stores.includes(filterStore);
              }
              return true;
            })}
            stores={stores}
            toggleComplete={toggleComplete}
            deleteItem={deleteItem}
            startEditing={setEditingItem}
            updateItemStores={updateItemStores}
          />
        </div>
      );
    }
    
    return (
      <ShoppingListView
        items={items}
        setItems={setItems}
        categories={categories}
        newItem={newItem}
        setNewItem={setNewItem}
        newItemCategory={newItemCategory}
        setNewItemCategory={setNewItemCategory}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        editItemName={editItemName}
        setEditItemName={setEditItemName}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        saveTemplateModalOpen={saveTemplateModalOpen}
        setSaveTemplateModalOpen={setSaveTemplateModalOpen}
        newTemplateName={newTemplateName}
        setNewTemplateName={setNewTemplateName}
        saveAsTemplate={saveAsTemplate}
        templates={templates}
        loadTemplate={loadTemplate}
        stores={stores}
        updateItemStores={updateItemStores}
        filterStore={filterStore}
        setFilterStore={setFilterStore}
        updateItemPrice={updateItemPrice}
        totalBudget={totalBudget}
        remainingBudget={remainingBudget}
        showBudgetSummary={totalBudget > 0}
        darkMode={darkMode}
        toggleListViewMode={toggleListViewMode}
        listViewMode={listViewMode}
      />
    );
  };

  // Renderowanie odpowiedniego widoku
  const renderActiveView = () => {
    switch(activeView) {
      case 'shopping-list':
        return renderShoppingList();
        
      case 'fridge':
        return (
          <FridgeView
            fridgeItems={fridgeItems}
            setFridgeItems={setFridgeItems}
            categories={categories}
            darkMode={darkMode}
          />
        );
        
      case 'recipes':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Przepisy</h2>
            <p>Ta funkcjonalność jest obecnie niedostępna.</p>
          </div>
        );
        
      case 'templates':
        return (
          <TemplatesView
            templates={templates}
            loadTemplate={loadTemplate}
            deleteTemplate={deleteTemplate}
            darkMode={darkMode}
          />
        );
        
      case 'categories':
        return (
          <CategoriesView
            categories={categories}
            addCategory={addCategory}
            editCategory={editCategory}
            deleteCategory={deleteCategory}
            resetCategories={resetCategories}
            darkMode={darkMode}
          />
        );
        
      case 'stores':
        return (
          <StoresView
            stores={stores}
            addStore={addStore}
            editStore={editStore}
            deleteStore={deleteStore}
            setStoreToVisit={setStoreToVisit}
            calculateOptimalRoute={calculateOptimalRoute}
            darkMode={darkMode}
          />
        );
        
      case 'budget':
        return (
          <BudgetView
            budget={budget}
            updateBudget={updateBudget}
            categoryBudgets={categoryBudgets}
            updateCategoryBudget={updateCategoryBudget}
            items={items}
            categories={categories}
            darkMode={darkMode}
          />
        );
        
      case 'menu-planner':
        return (
          <MenuPlannerView
            addItemsToShoppingList={addItems}
            recipes={recipes}
            fridgeItems={fridgeItems}
            darkMode={darkMode}
          />
        );
        
      case 'settings':
        return (
          <SettingsView
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <Layout
      darkMode={darkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      activeView={activeView}
      setActiveView={setActiveView}
      toggleDarkMode={toggleDarkMode}
      itemsCount={items.length}
      templatesCount={templates.length}
      categoriesCount={categories.length}
      storesCount={stores.length}
      storesToVisitCount={storesToVisit.length}
      fridgeItemsCount={fridgeItems.length}
      recipesCount={recipes.length}
      showBudget={true}
      budgetAmount={budget?.total || 0}
      remainingBudget={remainingBudget}
    >
      {renderActiveView()}
    </Layout>
  );
}

export default MainLayout;