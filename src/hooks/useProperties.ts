import { useState, useEffect } from 'react';
import { db } from '../services/database';
import type { Property, Mortgage, RentalIncome, Expense } from '../types';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    setLoading(true);
    const data = await db.properties.toArray();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProperty: Property = {
      ...property,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await db.properties.add(newProperty);
    await loadProperties();
    return newProperty;
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    await db.properties.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    await loadProperties();
  };

  const deleteProperty = async (id: string) => {
    await db.properties.delete(id);
    // Also delete related data
    await db.mortgages.where('propertyId').equals(id).delete();
    await db.rentalIncome.where('propertyId').equals(id).delete();
    await db.expenses.where('propertyId').equals(id).delete();
    await db.propertyValues.where('propertyId').equals(id).delete();
    await loadProperties();
  };

  return {
    properties,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    reload: loadProperties,
  };
}

export function useMortgages() {
  const [mortgages, setMortgages] = useState<Mortgage[]>([]);

  const loadMortgages = async () => {
    const data = await db.mortgages.toArray();
    setMortgages(data);
  };

  useEffect(() => {
    loadMortgages();
  }, []);

  const addMortgage = async (mortgage: Omit<Mortgage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMortgage: Mortgage = {
      ...mortgage,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await db.mortgages.add(newMortgage);
    await loadMortgages();
  };

  const updateMortgage = async (id: string, updates: Partial<Mortgage>) => {
    await db.mortgages.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    await loadMortgages();
  };

  const deleteMortgage = async (id: string) => {
    await db.mortgages.delete(id);
    await loadMortgages();
  };

  return {
    mortgages,
    addMortgage,
    updateMortgage,
    deleteMortgage,
    reload: loadMortgages,
  };
}

export function useRentalIncome() {
  const [income, setIncome] = useState<RentalIncome[]>([]);

  const loadIncome = async () => {
    const data = await db.rentalIncome.toArray();
    setIncome(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    loadIncome();
  }, []);

  const addIncome = async (incomeData: Omit<RentalIncome, 'id' | 'createdAt'>) => {
    const newIncome: RentalIncome = {
      ...incomeData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.rentalIncome.add(newIncome);
    await loadIncome();
  };

  const deleteIncome = async (id: string) => {
    await db.rentalIncome.delete(id);
    await loadIncome();
  };

  return {
    income,
    addIncome,
    deleteIncome,
    reload: loadIncome,
  };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const loadExpenses = async () => {
    const data = await db.expenses.toArray();
    setExpenses(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.expenses.add(newExpense);
    await loadExpenses();
  };

  const deleteExpense = async (id: string) => {
    await db.expenses.delete(id);
    await loadExpenses();
  };

  return {
    expenses,
    addExpense,
    deleteExpense,
    reload: loadExpenses,
  };
}
