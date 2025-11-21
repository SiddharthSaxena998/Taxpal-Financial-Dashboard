export const COUNTRIES = {
  'United States': {
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    states: ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan']
  },
  'India': {
    name: 'India',
    currency: 'INR',
    symbol: '₹',
    states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Telangana', 'Kerala']
  },
  'UK': {
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    states: ['England', 'Scotland', 'Wales', 'Northern Ireland']
  },
  'Canada': {
    name: 'Canada',
    currency: 'CAD',
    symbol: 'C$',
    states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick']
  },
  'Australia': {
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania']
  },
  'Germany': {
    name: 'Germany',
    currency: 'EUR',
    symbol: '€',
    states: ['Bavaria', 'Berlin', 'Hamburg', 'Hesse', 'North Rhine-Westphalia', 'Saxony']
  },
  'France': {
    name: 'France',
    currency: 'EUR',
    symbol: '€',
    states: ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France']
  },
  'Japan': {
    name: 'Japan',
    currency: 'JPY',
    symbol: '¥',
    states: ['Tokyo', 'Osaka', 'Kanagawa', 'Aichi', 'Saitama', 'Chiba', 'Hyogo', 'Hokkaido']
  }
};

export type CountryKey = keyof typeof COUNTRIES;

export function getCurrencySymbol(country: string): string {
  const countryData = COUNTRIES[country as CountryKey];
  return countryData?.symbol || '$';
}

export function getCountryStates(country: string): string[] {
  const countryData = COUNTRIES[country as CountryKey];
  return countryData?.states || [];
}

export function formatCurrency(value: number, country: string = 'United States'): string {
  const symbol = getCurrencySymbol(country);
  return `${symbol}${Number(value).toFixed(2)}`;
}

export function getUserCountry(): string {
  const savedCountry = localStorage.getItem('userCountry');
  if (savedCountry) return savedCountry;
  return 'United States';
}

export function setUserCountry(country: string): void {
  localStorage.setItem('userCountry', country);
}