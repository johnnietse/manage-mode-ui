
import React, { createContext, useContext, useState } from 'react';

interface CategoryContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  return (
    <CategoryContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
}
