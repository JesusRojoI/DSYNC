'use client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import Link from 'next/link'

const PlansSection = () => {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    t('plans.tab_start'),
    t('plans.tab_scale'),
    t('plans.tab_domination'),
    t('plans.tab_custom'),
  ]

  const planIds = [
    [
      'auditoria-seo-express',
      'optimizacion-producto-individual',
      'diagnostico-tienda-online',
      'keywords-iniciales',
      'categoria-optimizada',
      'mini-seo-setup',
      'landing-producto-seo',
    ],
    [
      'tienda-basica-seo',
      'seo-catalogo-inicial',
      'tienda-optimizada-starter',
      'ecommerce-seo-inicial',
      'tienda-contenido-basico',
      'posicionamiento-inicial-ecommerce',
    ],
    [
      'tienda-seo-estrategica',
      'ecommerce-blog-seo',
      'tienda-organica-expandida',
      'seo-contenido-estrategico',
      'ecommerce-seo-profesional',
    ],
    ['plan-orbita-360'],
  ]

  const planPrices = {
    'auditoria-seo-express': 560,
    'optimizacion-producto-individual': 980,
    'diagnostico-tienda-online': 1200,
    'keywords-iniciales': 1500,
    'categoria-optimizada': 2280,
    'mini-seo-setup': 2990,
    'landing-producto-seo': 3850,
    'tienda-basica-seo': 4780,
    'seo-catalogo-inicial': 6680,
    'tienda-optimizada-starter': 8900,
    'ecommerce-seo-inicial': 11670,
    'tienda-contenido-basico': 13790,
    'posicionamiento-inicial-ecommerce': 15760,
    'tienda-seo-estrategica': 19260,
    'ecommerce-blog-seo': 22970,
    'tienda-organica-expandida': 28760,
    'seo-contenido-estrategico': 33690,
    'ecommerce-seo-profesional': 39870,
    'plan-orbita-360': null,
  }

  const categories = {
    0: t('plans.tab_start'),
    1: t('plans.tab_scale'),
    2: t('plans.tab_domination'),
    3: t('plans.tab_custom'),
  }

  const handleAddToCart = (planId) => {
    const planName = t(`product.items.${planId}.name`)
    const planPrice = planPrices[planId]
    
    addToCart({
      id: planId,
      name: planName,
      price: typeof planPrice === 'number' ? planPrice : 0,
      category: categories[activeTab],
    })
  }

  const getProductSlug = (planId) => {
    return planId.replace(/_/g, '-')
  }

  const formatPrice = (price) => {
    return price.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <section id="planes" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-12"
        >
          {t('plans.title')}
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === index
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {planIds[activeTab].map((planId, index) => {
              const planName = t(`product.items.${planId}.name`)
              const planDescription = t(`product.items.${planId}.description`)
              const planFeatures = t(`product.items.${planId}.features`, { returnObjects: true })
              const planPrice = planPrices[planId]
              const isCustom = planId === 'plan-orbita-360'
              const productSlug = getProductSlug(planId)

              return (
                <motion.div
                  key={planId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col"
                >
                  <Link href={`/producto/${productSlug}`} className="p-8 flex-1 block">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-gray-600 transition-colors">
                      {planName}
                    </h3>
                    
                    <div className="mb-4">
                      {typeof planPrice === 'number' ? (
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-gray-900">
                            ${formatPrice(planPrice)}
                          </span>
                          <span className="text-gray-600 ml-2">{t('product.mxn_iva')}</span>
                        </div>
                      ) : (
                        <div className="text-3xl font-bold text-gray-900">
                          {t('plans.tab_custom')}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-6">{planDescription}</p>

                    <ul className="space-y-3 mb-6">
                      {Array.isArray(planFeatures) && planFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Link>

                  <div className="px-8 pb-8 space-y-3">
                    {isCustom ? (
                      <>
                        <Link
                          href={`/producto/${productSlug}`}
                          className="block w-full py-3 bg-gray-900 text-white rounded-full font-medium text-center hover:bg-gray-800 transition-colors"
                        >
                          {t('plans.contract')}
                        </Link>
                        <a
                          href="/#contactanos"
                          className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium text-center hover:border-gray-400 transition-colors"
                        >
                          {t('plans.contact')}
                        </a>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(planId)}
                        className="w-full py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                      >
                        {t('plans.contract')}
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default PlansSection