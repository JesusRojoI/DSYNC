'use client'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext'
import '../i18n/config'

const I18nProvider = ({ children }) => {
  const { i18n } = useTranslation()
  const { cartItems, updateItemName } = useCart()

  useEffect(() => {
    cartItems.forEach(item => {
      // Obtener el nombre traducido
      let translationKey = `product.items.${item.id}.name`
      
      // Si es un producto personalizado (tiene ID único con timestamp)
      if (item.isCustom) {
        // Para productos personalizados, solo traducir la categoría
        const categoryKey = item.categoryKey || getCategoryKey(item.category)
        const translatedCategory = i18n.t(categoryKey)
        if (translatedCategory !== item.category && translatedCategory !== categoryKey) {
          updateItemName(item.id, item.name, translatedCategory)
        }
        return
      }
      
      const translatedName = i18n.t(translationKey)
      
      // Determinar la clave de categoría
      const categoryKey = item.categoryKey || getCategoryKey(item.category)
      const translatedCategory = i18n.t(categoryKey)
      
      if ((translatedName !== item.name && translatedName !== translationKey) || 
          (translatedCategory !== item.category && translatedCategory !== categoryKey)) {
        updateItemName(item.id, translatedName, translatedCategory)
      }
    })
  }, [i18n.language])

  // Función para obtener la clave de categoría basada en el nombre actual
  const getCategoryKey = (categoryName) => {
    const categoryMap = {
      'Planes Arranque': 'plans.tab_start',
      'Start Plans': 'plans.tab_start',
      'Planes Escala': 'plans.tab_scale',
      'Scale Plans': 'plans.tab_scale',
      'Planes Dominación': 'plans.tab_domination',
      'Domination Plans': 'plans.tab_domination',
      'Plan Personalizado': 'plans.tab_custom',
      'Custom Plan': 'plans.tab_custom',
    }
    return categoryMap[categoryName] || null
  }

  return <>{children}</>
}

export default I18nProvider