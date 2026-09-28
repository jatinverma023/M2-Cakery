/**
 * WhatsApp Click-to-Chat utility for M² Cakery.
 * Centralizes phone number formatting and pre-filled inquiry messages.
 */

export const WHATSAPP_PHONE_RAW = '918491957400'
export const WHATSAPP_PHONE_DISPLAY = '+91 84919 57400'

/**
 * Build a WhatsApp URL with an encoded message.
 * @param {string} [message]
 * @returns {string}
 */
export function getWhatsAppUrl(message) {
  const base = `https://wa.me/${WHATSAPP_PHONE_RAW}`
  if (!message) {
    const defaultMsg = 'Hi M² Cakery! I would like to enquire about ordering a cake.'
    return `${base}?text=${encodeURIComponent(defaultMsg)}`
  }
  return `${base}?text=${encodeURIComponent(message)}`
}

/**
 * Build a contextual WhatsApp URL for a specific ready product.
 * @param {object} product
 * @returns {string}
 */
export function getProductWhatsAppUrl(product) {
  const msg = `Hi M² Cakery! I would like to enquire about ordering the "${product.name}". Could you please share availability and pricing details?`
  return getWhatsAppUrl(msg)
}
