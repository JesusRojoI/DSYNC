'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '../../contexts/CartContext'

export default function SuccessPage() {
  const { t } = useTranslation()
  const { clearCart } = useCart()
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    const savedOrderId = sessionStorage.getItem('lastOrderId')
    const savedOrderTotal = sessionStorage.getItem('lastOrderTotal')
    
    if (savedOrderId) {
      setOrderData({
        orderId: savedOrderId,
        total: savedOrderTotal,
      })
    }

    clearCart()

    const timer = setTimeout(() => {
      sessionStorage.removeItem('lastOrderId')
      sessionStorage.removeItem('lastOrderTotal')
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('success.title')}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {t('success.message')}
          </p>

          {orderData && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 inline-block">
              <p className="text-sm text-gray-600 mb-1">{t('success.order_number')}</p>
              <p className="text-2xl font-bold text-gray-900">#{orderData.orderId}</p>
              {orderData.total && (
                <p className="text-lg font-semibold text-green-700 mt-2">
                  {t('success.total_paid')}: ${orderData.total} MXN
                </p>
              )}
            </div>
          )}

          <p className="text-gray-600 mb-8">
            {t('success.support_message')}{' '}
            <a href="mailto:informes@dsynk.com" className="text-gray-900 font-semibold hover:underline">
              informes@dsynk.com
            </a>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg"
            >
              {t('success.back_to_home')}
            </Link>
            
            
          </div>
        </motion.div>
      </div>
    </div>
  )
}