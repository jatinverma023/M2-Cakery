/**
 * Central site configuration for M² Cakery.
 * Strictly adheres to brand guidelines and verified business information.
 */

import { WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_DISPLAY, getWhatsAppUrl } from '../utils/whatsapp'

export const SITE_CONFIG = {
  name: 'M² Cakery',
  tagline: 'Bespoke cakes, gourmet cupcakes and signature celebration desserts',
  location: 'Jakh, Samba',
  fullLocation: 'Jakh, Samba, Jammu & Kashmir, India',
  phoneDisplay: WHATSAPP_PHONE_DISPLAY,
  phoneRaw: WHATSAPP_PHONE_RAW,
  instagramHandle: '@m2_cakery_',
  instagramUrl: 'https://instagram.com/m2_cakery_',
  rating: '4.8',
  metrics: [
    { value: '320+', label: 'Cakes baked & shared' },
    { value: '1,700+', label: 'Happy followers' },
    { value: '4.8 ★', label: 'Customer rating' },
  ],
  announcement: {
    enabled: true,
    text: 'Taking orders for celebrations · Book custom cakes 48 hours in advance',
    linkText: 'Order on WhatsApp →',
    isWhatsApp: true,
  },
  navLinks: [
    { label: 'Cakes', href: '#collection' },
    { label: 'Cupcakes & Desserts', href: '#collection' },
    { label: 'Weddings & Events', href: '#featured' },
    { label: 'Our Story', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'How to Order', href: '#how-to-order' },
  ],
  drawerLinks: [
    { label: 'Cakes', href: '#collection' },
    { label: 'Cupcakes & Desserts', href: '#collection' },
    { label: 'Weddings & Events', href: '#featured' },
    { label: 'Why M² Cakery', href: '#why-us' },
    { label: 'Our Story', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'How to Order', href: '#how-to-order' },
    { label: 'FAQ', href: '#faq' },
  ],
}

export { getWhatsAppUrl }
