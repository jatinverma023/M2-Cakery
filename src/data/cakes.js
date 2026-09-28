/**
 * M² Cakery — Cake Portfolio Data Architecture
 * 
 * IMPORTANT:
 * - Real photographs will be added by the owner later.
 * - Placeholder image is assigned as temporary visual placeholder.
 * - No fake prices, sizes, flavours, or ratings are invented.
 * - Simple replacement: import owner photo and assign to `image`.
 */

import cakePlaceholder from '../assets/cakes/cake-placeholder.svg'

export const CAKE_CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'birthday', label: 'BIRTHDAY' },
  { id: 'wedding', label: 'WEDDING' },
  { id: 'anniversary', label: 'ANNIVERSARY' },
  { id: 'celebration', label: 'CELEBRATION' },
  { id: 'custom', label: 'CUSTOM & THEME' },
]

export const CATEGORY_LABELS = {
  birthday: 'Birthday',
  wedding: 'Wedding',
  anniversary: 'Anniversary',
  celebration: 'Celebration',
  custom: 'Custom & Theme',
  desserts: 'Desserts & Treats',
}

export const CAKES = [
  // --- Birthday Cakes ---
  {
    id: 'birthday-cake-01',
    title: 'Bespoke Birthday Cake',
    category: 'birthday',
    image: cakePlaceholder,
    description: 'Handcrafted celebration cake designed to make birthday celebrations unforgettable.',
    featured: true,
  },
  {
    id: 'birthday-cake-02',
    title: 'Floral Birthday Cake',
    category: 'birthday',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },
  {
    id: 'birthday-cake-03',
    title: 'Delicate Piped Birthday Cake',
    category: 'birthday',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },
  {
    id: 'birthday-cake-04',
    title: 'Kids Milestone Birthday Cake',
    category: 'birthday',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },

  // --- Wedding Cakes ---
  {
    id: 'wedding-cake-01',
    title: 'Tiered Floral Wedding Cake',
    category: 'wedding',
    image: cakePlaceholder,
    description: 'Multi-tiered celebration showpiece crafted for intimate weddings and festive receptions.',
    featured: true,
  },
  {
    id: 'wedding-cake-02',
    title: 'Classic Elegant Wedding Cake',
    category: 'wedding',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },
  {
    id: 'wedding-cake-03',
    title: 'Botanical Garden Wedding Cake',
    category: 'wedding',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },

  // --- Anniversary Cakes ---
  {
    id: 'anniversary-cake-01',
    title: 'Milestone Anniversary Cake',
    category: 'anniversary',
    image: cakePlaceholder,
    description: 'Romantic anniversary design celebrating love and cherished milestones.',
    featured: true,
  },
  {
    id: 'anniversary-cake-02',
    title: 'Heart-Piped Anniversary Cake',
    category: 'anniversary',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },
  {
    id: 'anniversary-cake-03',
    title: 'Golden Milestone Anniversary Cake',
    category: 'anniversary',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },

  // --- Celebration Cakes ---
  {
    id: 'celebration-cake-01',
    title: 'Signature Celebration Cake',
    category: 'celebration',
    image: cakePlaceholder,
    description: 'Created for special moments, festive family gatherings, and joyful milestones.',
    featured: false,
  },
  {
    id: 'celebration-cake-02',
    title: 'Festive Drip Celebration Cake',
    category: 'celebration',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },
  {
    id: 'celebration-cake-03',
    title: 'Pastel Palette Celebration Cake',
    category: 'celebration',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },

  // --- Custom & Theme Cakes ---
  {
    id: 'custom-theme-cake-01',
    title: 'Custom Character Theme Cake',
    category: 'custom',
    image: cakePlaceholder,
    description: 'Custom-sculpted theme cake designed from client vision and celebration themes.',
    featured: false,
  },
  {
    id: 'custom-theme-cake-02',
    title: 'Bespoke Sculpted Theme Cake',
    category: 'custom',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },
  {
    id: 'custom-theme-cake-03',
    title: 'Modern Artistic Concept Cake',
    category: 'custom',
    image: cakePlaceholder,
    description: '',
    featured: false,
  },
]
