'use client'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi'
import { useCart } from '../../contexts/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { t } = useTranslation()
  const { cartItems, removeFromCart, updateQuantity } = useCart()
  const router = useRouter()
  
  const [editableItems, setEditableItems] = useState([])
  const [hasChanges, setHasChanges] = useState(false)
  const [showCheckoutWarning, setShowCheckoutWarning] = useState(false)

  const formatPrice = (price) => {
    return price.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  useEffect(() => {
    setEditableItems(cartItems.map(item => ({ ...item })))
    setHasChanges(false)
  }, [cartItems])

  const getProductSlug = (planId) => {
    return planId ? planId.replace(/_/g, '-') : '#'
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return
    
    setEditableItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
    setHasChanges(true)
  }

  const handleRemoveItem = (productId) => {
    setEditableItems(prev => prev.filter(item => item.id !== productId))
    setHasChanges(true)
  }

  const handleUpdateCart = () => {
    editableItems.forEach(item => {
      const originalItem = cartItems.find(orig => orig.id === item.id)
      if (originalItem) {
        if (originalItem.quantity !== item.quantity) {
          updateQuantity(item.id, item.quantity)
        }
      }
    })

    const editableIds = editableItems.map(item => item.id)
    cartItems.forEach(item => {
      if (!editableIds.includes(item.id)) {
        removeFromCart(item.id)
      }
    })

    setHasChanges(false)
  }

  const handleCheckout = () => {
    if (hasChanges) {
      setShowCheckoutWarning(true)
    } else {
      router.push('/checkout')
    }
  }

  const handleUpdateAndCheckout = () => {
    handleUpdateCart()
    setShowCheckoutWarning(false)
    router.push('/checkout')
  }

  const handleCheckoutWithoutUpdate = () => {
    setShowCheckoutWarning(false)
    router.push('/checkout')
  }

  const subtotal = editableItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  if (editableItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FiShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('cart.empty_title')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('cart.empty_message')}
            </p>
            <Link
              href="/#planes"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              {t('cart.view_plans')}
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('cart.title')}</h1>

          {/* Tabla del carrito */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {/* Encabezado de la tabla */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-medium text-gray-700">
              <div className="col-span-5">{t('cart.product')}</div>
              <div className="col-span-2 text-center">{t('cart.price')}</div>
              <div className="col-span-2 text-center">{t('cart.quantity')}</div>
              <div className="col-span-2 text-center">{t('cart.subtotal')}</div>
              <div className="col-span-1"></div>
            </div>

            {/* Items del carrito */}
            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {editableItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center"
                  >
                    {/* Producto */}
                    <div className="md:col-span-5 flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FiShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <Link
                          href={`/producto/${getProductSlug(item.id)}`}
                          className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                        {item.category && (
                          <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                        )}
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="md:col-span-2 text-center">
                      <span className="md:hidden text-sm text-gray-500">{t('cart.price')}: </span>
                      <span className="text-sm font-medium">
                        ${formatPrice(item.price)}
                      </span>
                    </div>

                    {/* Cantidad */}
                    <div className="md:col-span-2 flex justify-center">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value)
                            if (val > 0) handleQuantityChange(item.id, val)
                          }}
                          className="w-16 text-center border border-gray-300 rounded-lg py-1 text-sm"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="md:col-span-2 text-center">
                      <span className="md:hidden text-sm text-gray-500">{t('cart.subtotal')}: </span>
                      <span className="text-sm font-bold text-green-700">
                        ${formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Eliminar */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title={t('cart.remove_item')}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Botón Actualizar */}
          <div className="flex justify-end mb-8">
            <motion.button
              onClick={handleUpdateCart}
              disabled={!hasChanges}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                hasChanges
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={hasChanges ? { scale: 1.05 } : {}}
              whileTap={hasChanges ? { scale: 0.95 } : {}}
            >
              {t('cart.update_cart')}
            </motion.button>
          </div>

          {/* Totales */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cart.total_section')}</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span className="text-lg font-medium">${formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('cart.iva')}</span>
                <span className="text-lg font-medium">${formatPrice(iva)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">{t('cart.total')}</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleCheckout}
              className="w-full mt-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('cart.checkout')}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Modal de advertencia */}
      <AnimatePresence>
        {showCheckoutWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('cart.warning_title')}
                </h3>
                <p className="text-gray-600">
                  {t('cart.warning_message')}
                </p>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={handleUpdateAndCheckout}
                  className="w-full py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('cart.update_and_continue')}
                </motion.button>
                
                <button
                  onClick={handleCheckoutWithoutUpdate}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400 transition-colors"
                >
                  {t('cart.continue_without_update')}
                </button>
                
                <button
                  onClick={() => setShowCheckoutWarning(false)}
                  className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t('cart.cancel')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}