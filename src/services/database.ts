import Dexie, { type Table } from 'dexie';
import type { Property, Mortgage, RentalIncome, Expense, PropertyValue } from '../types';

export class RealEstateDatabase extends Dexie {
  properties!: Table<Property>;
  mortgages!: Table<Mortgage>;
  rentalIncome!: Table<RentalIncome>;
  expenses!: Table<Expense>;
  propertyValues!: Table<PropertyValue>;

  constructor() {
    super('RealEstateInvestmentDB');
    this.version(1).stores({
      properties: 'id, address, city, state, propertyType, purchaseDate',
      mortgages: 'id, propertyId, lender, startDate',
      rentalIncome: 'id, propertyId, date, type',
      expenses: 'id, propertyId, date, category',
      propertyValues: 'id, propertyId, date, source',
    });
  }
}

export const db = new RealEstateDatabase();
