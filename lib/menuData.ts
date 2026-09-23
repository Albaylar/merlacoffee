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
  { id: '1', category: 'coffee', name: { de: 'Espresso', en: 'Espresso', tr: 'Espresso' }, price: '2,80 €', image: 'https://picsum.photos/seed/espresso-merla/600/400' },
  { id: '2', category: 'coffee', name: { de: 'Flat White', en: 'Flat White', tr: 'Flat White' }, price: '4,20 €', image: 'https://picsum.photos/seed/flatwhite-merla/600/400' },
  { id: '3', category: 'coffee', name: { de: 'Filter Kaffee', en: 'Filter Coffee', tr: 'Filtre Kahve' }, price: '3,50 €', image: 'https://picsum.photos/seed/filter-merla/600/400' },
  { id: '4', category: 'coffee', name: { de: 'Cappuccino', en: 'Cappuccino', tr: 'Cappuccino' }, price: '3,80 €', image: 'https://picsum.photos/seed/cappuccino-merla/600/400' },
  { id: '5', category: 'tea', name: { de: 'Matcha Latte', en: 'Matcha Latte', tr: 'Matcha Latte' }, price: '4,50 €', image: 'https://picsum.photos/seed/matcha-merla/600/400' },
  { id: '6', category: 'tea', name: { de: 'Chai Latte', en: 'Chai Latte', tr: 'Chai Latte' }, price: '4,00 €', image: 'https://picsum.photos/seed/chai-merla/600/400' },
  { id: '7', category: 'food', name: { de: 'Avocado Toast', en: 'Avocado Toast', tr: 'Avokado Toast' }, price: '8,50 €', image: 'https://picsum.photos/seed/avotoast-merla/600/400' },
  { id: '8', category: 'food', name: { de: 'Croissant', en: 'Croissant', tr: 'Kruasan' }, price: '3,20 €', image: 'https://picsum.photos/seed/croissant-merla/600/400' },
  { id: '9', category: 'dessert', name: { de: 'Cheesecake', en: 'Cheesecake', tr: 'Cheesecake' }, price: '5,50 €', image: 'https://picsum.photos/seed/cheesecake-merla/600/400' },
  { id: '10', category: 'dessert', name: { de: 'Brownie', en: 'Brownie', tr: 'Brownie' }, price: '3,80 €', image: 'https://picsum.photos/seed/brownie-merla/600/400' },
];

export const CATEGORIES: MenuCategory[] = ['all', 'coffee', 'tea', 'food', 'dessert'];
