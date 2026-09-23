// lib/menuData.ts
export type MenuCategory = 'all' | 'coffee' | 'tea' | 'food' | 'dessert';

export interface MenuItem {
  id: string;
  category: Exclude<MenuCategory, 'all'>;
  name: { de: string; en: string; tr: string };
  price: string;
  image: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { id: '1', category: 'coffee', name: { de: 'Espresso', en: 'Espresso', tr: 'Espresso' }, price: '2,80 €', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=400&q=80&auto=format&fit=crop' },
  { id: '2', category: 'coffee', name: { de: 'Flat White', en: 'Flat White', tr: 'Flat White' }, price: '4,20 €', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&h=400&q=80&auto=format&fit=crop' },
  { id: '3', category: 'coffee', name: { de: 'Filter Kaffee', en: 'Filter Coffee', tr: 'Filtre Kahve' }, price: '3,50 €', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&q=80&auto=format&fit=crop' },
  { id: '4', category: 'coffee', name: { de: 'Cappuccino', en: 'Cappuccino', tr: 'Cappuccino' }, price: '3,80 €', image: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=600&h=400&q=80&auto=format&fit=crop' },
  { id: '5', category: 'tea', name: { de: 'Matcha Latte', en: 'Matcha Latte', tr: 'Matcha Latte' }, price: '4,50 €', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&q=80&auto=format&fit=crop' },
  { id: '6', category: 'tea', name: { de: 'Chai Latte', en: 'Chai Latte', tr: 'Chai Latte' }, price: '4,00 €', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&h=400&q=80&auto=format&fit=crop' },
  { id: '7', category: 'food', name: { de: 'Avocado Toast', en: 'Avocado Toast', tr: 'Avokado Toast' }, price: '8,50 €', image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&h=400&q=80&auto=format&fit=crop' },
  { id: '8', category: 'food', name: { de: 'Croissant', en: 'Croissant', tr: 'Kruasan' }, price: '3,20 €', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&q=80&auto=format&fit=crop' },
  { id: '9', category: 'dessert', name: { de: 'Cheesecake', en: 'Cheesecake', tr: 'Cheesecake' }, price: '5,50 €', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=400&q=80&auto=format&fit=crop' },
  { id: '10', category: 'dessert', name: { de: 'Brownie', en: 'Brownie', tr: 'Brownie' }, price: '3,80 €', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&h=400&q=80&auto=format&fit=crop' },
];

export const CATEGORIES: MenuCategory[] = ['all', 'coffee', 'tea', 'food', 'dessert'];
