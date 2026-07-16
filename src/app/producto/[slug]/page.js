'use client'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useCart } from '../../../contexts/CartContext'
import Link from 'next/link'

const productsData = {
  'auditoria-seo-express': { price: 560, category: 0, icon: '🔍' },
  'optimizacion-producto-individual': { price: 980, category: 0, icon: '📦' },
  'diagnostico-tienda-online': { price: 1200, category: 0, icon: '🔍' },
  'keywords-iniciales': { price: 1500, category: 0, icon: '🔑' },
  'categoria-optimizada': { price: 2280, category: 0, icon: '📁' },
  'mini-seo-setup': { price: 2990, category: 0, icon: '⚙️' },
  'landing-producto-seo': { price: 3850, category: 0, icon: '🚀' },
  'tienda-basica-seo': { price: 4780, category: 1, icon: '🏪' },
  'seo-catalogo-inicial': { price: 6680, category: 1, icon: '📚' },
  'tienda-optimizada-starter': { price: 8900, category: 1, icon: '⭐' },
  'ecommerce-seo-inicial': { price: 11670, category: 1, icon: '🛒' },
  'tienda-contenido-basico': { price: 13790, category: 1, icon: '📝' },
  'posicionamiento-inicial-ecommerce': { price: 15760, category: 1, icon: '📈' },
  'tienda-seo-estrategica': { price: 19260, category: 2, icon: '🎯' },
  'ecommerce-blog-seo': { price: 22970, category: 2, icon: '✍️' },
  'tienda-organica-expandida': { price: 28760, category: 2, icon: '🌱' },
  'seo-contenido-estrategico': { price: 33690, category: 2, icon: '💡' },
  'ecommerce-seo-profesional': { price: 39870, category: 2, icon: '👔' },
  'plan-orbita-360': { price: null, category: 3, icon: '🌐', isCustom: true },
}

const categoryNames = {
  0: 'plans.tab_start',
  1: 'plans.tab_scale',
  2: 'plans.tab_domination',
  3: 'plans.tab_custom',
}

const categorySlugs = {
  0: 'planes-arranque',
  1: 'planes-escala',
  2: 'planes-dominacion',
  3: 'plan-personalizado',
}

export default function ProductPage() {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [productId, setProductId] = useState(null)
  const [folioNumber, setFolioNumber] = useState('')
  const [customTotal, setCustomTotal] = useState('')
  const [customName, setCustomName] = useState('')
  const [customErrors, setCustomErrors] = useState({})

  useEffect(() => {
    if (params?.slug) {
      const slug = params.slug
      const possibleId = slug.replace(/-/g, '_')
      
      if (productsData[possibleId]) {
        setProductId(possibleId)
      } else {
        const allKeys = Object.keys(productsData)
        const foundId = allKeys.find(key => key.replace(/_/g, '-') === slug)
        setProductId(foundId)
      }
    }
  }, [params])

  if (!productId || !productsData[productId]) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link href="/#planes" className="text-gray-600 hover:text-gray-900 underline">
            Volver a planes
          </Link>
        </div>
      </div>
    )
  }

  const product = productsData[productId]
  const productName = t(`product.items.${productId}.name`)
  const productDescription = t(`product.items.${productId}.description`)
  const productFeatures = t(`product.items.${productId}.features`, { returnObjects: true })
  const categoryName = t(categoryNames[product.category])
  const categorySlug = categorySlugs[product.category]
  const isCustom = product.isCustom || false

  const validateCustomForm = () => {
    const errors = {}
    
    if (!folioNumber.trim()) {
      errors.folio = t('product.folio_required')
    }
    
    if (!customTotal || parseFloat(customTotal) <= 0) {
      errors.total = t('product.total_invalid')
    }
    
    if (customTotal && !/^\d+(\.\d{0,2})?$/.test(customTotal)) {
      errors.total = t('product.total_max_decimals')
    }
    
    if (!customName.trim()) {
      errors.name = t('contact.validation.name_required')
    }
    
    setCustomErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCustomTotalChange = (e) => {
    let value = e.target.value
    value = value.replace(/[^0-9.]/g, '')
    const parts = value.split('.')
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('')
    }
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2)
    }
    setCustomTotal(value)
    if (customErrors.total) {
      setCustomErrors(prev => ({ ...prev, total: '' }))
    }
  }

  const handleAddToCart = () => {
    if (isCustom) {
      if (!validateCustomForm()) return
      
      const totalPrice = parseFloat(customTotal)
      
      addToCart({
        id: `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: `${productName}: ${customName}`,
        price: totalPrice,
        category: categoryName,
        isCustom: true,
        folio: folioNumber,
        customName: customName,
      })
      
      setFolioNumber('')
      setCustomTotal('')
      setCustomName('')
      setCustomErrors({})
      
    } else {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: productId,
          name: productName,
          price: typeof product.price === 'number' ? product.price : 0,
          category: categoryName,
        })
      }
    }
  }

  const formatPrice = (price) => {
    if (typeof price !== 'number') return price
    return price.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              {t('product.breadcrumb_home')}
            </Link>
            <span>/</span>
            <Link href={`/categoria-producto/${categorySlug}`} className="hover:text-gray-900 transition-colors">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{productName}</span>
          </nav>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-gray-50 flex items-center justify-center p-12"
            >
              <div className="text-center">
                <div className="text-8xl mb-6">{product.icon}</div>
                <img 
                  src="/logo.svg" 
                  alt="DSYNC" 
                  className="mx-auto opacity-80"
                  style={{ width: '60%' }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3 p-8 sm:p-12"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {productName}
              </h1>

              <div className="mb-6">
                {typeof product.price === 'number' ? (
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      ${formatPrice(product.price)}
                    </span>
                    <span className="text-gray-600 ml-2">{t('product.mxn_iva')}</span>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-gray-900">
                    {t('plans.tab_custom')}
                  </div>
                )}
              </div>

              <p className="text-lg text-gray-600 mb-8">
                {productDescription}
              </p>

              {isCustom ? (
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('product.folio_number')} *
                    </label>
                    <input
                      type="text"
                      value={folioNumber}
                      onChange={(e) => {
                        setFolioNumber(e.target.value)
                        if (customErrors.folio) setCustomErrors(prev => ({ ...prev, folio: '' }))
                      }}
                      placeholder={t('product.folio_placeholder')}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        customErrors.folio ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                    />
                    {customErrors.folio && (
                      <p className="mt-1 text-sm text-red-500">{customErrors.folio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('product.custom_total')} *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500">$</span>
                      <input
                        type="text"
                        value={customTotal}
                        onChange={handleCustomTotalChange}
                        placeholder={t('product.total_placeholder')}
                        className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                          customErrors.total ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                      />
                    </div>
                    {customErrors.total && (
                      <p className="mt-1 text-sm text-red-500">{customErrors.total}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">{t('product.total_max_decimals')}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.name')} *
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => {
                        setCustomName(e.target.value)
                        if (customErrors.name) setCustomErrors(prev => ({ ...prev, name: '' }))
                      }}
                      placeholder={t('contact.name')}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        customErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                    />
                    {customErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{customErrors.name}</p>
                    )}
                  </div>

                  <motion.button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('product.add_to_cart')}
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('product.quantity')}
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl mb-8"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('product.add_to_cart')}
                  </motion.button>
                </>
              )}

              <div className="mb-8">
                <span className="text-sm text-gray-500">{t('product.category_label')}: </span>
                <Link 
                  href={`/categoria-producto/${categorySlug}`}
                  className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  {categoryName}
                </Link>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t('product.features_title')}
                </h3>
                <ul className="space-y-3">
                  {Array.isArray(productFeatures) && productFeatures.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-start"
                    >
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}