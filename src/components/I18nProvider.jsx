'use client'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext'
import '../i18n/config'

const I18nProvider = ({ children }) => {
  const { i18n } = useTranslation()
  const { cartItems, updateItemName } = useCart()

  // Actualizar nombres en el carrito cuando cambia el idioma
  useEffect(() => {
    cartItems.forEach(item => {
      const translationKey = `product.items.${item.id}.name`
      const translatedName = i18n.t(translationKey)
      if (translatedName !== item.name && translatedName !== translationKey) {
        updateItemName(item.id, translatedName)
      }
    })
  }, [i18n.language])

  return <>{children}</>
}

export default I18nProvider