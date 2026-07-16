'use client'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
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

const categorySlugs = {
  'planes-arranque': 0,
  'planes-escala': 1,
  'planes-dominacion': 2,
  'plan-personalizado': 3,
}

const categoryNames = {
  0: 'plans.tab_start',
  1: 'plans.tab_scale',
  2: 'plans.tab_domination',
  3: 'plans.tab_custom',
}

export default function CategoryPage() {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const params = useParams()
  const [sortBy, setSortBy] = useState('default')
  const [products, setProducts] = useState([])

  const categorySlug = params?.slug
  const categoryId = categorySlugs[categorySlug]
  const categoryName = categoryId !== undefined ? t(categoryNames[categoryId]) : ''

  useEffect(() => {
    if (categoryId !== undefined) {
      const filteredProducts = Object.entries(productsData)
        .filter(([_, data]) => data.category === categoryId)
        .map(([id, data]) => ({ id, ...data }))

      setProducts(filteredProducts)
    }
  }, [categoryId])

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = typeof a.price === 'number' ? a.price : 0
    const priceB = typeof b.price === 'number' ? b.price : 0
    const nameA = t(`product.items.${a.id}.name`)
    const nameB = t(`product.items.${b.id}.name`)

    switch (sortBy) {
      case 'name-asc':
        return nameA.localeCompare(nameB)
      case 'name-desc':
        return nameB.localeCompare(nameA)
      case 'price-asc':
        return priceA - priceB
      case 'price-desc':
        return priceB - priceA
      default:
        return 0
    }
  })

  const getProductSlug = (planId) => {
    return planId.replace(/_/g, '-')
  }

  const formatPrice = (price) => {
    if (typeof price !== 'number') return price
    return price.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleAddToCart = (product) => {
    if (product.isCustom) return
    
    addToCart({
      id: product.id,
      name: t(`product.items.${product.id}.name`),
      price: typeof product.price === 'number' ? product.price : 0,
      category: categoryName,
    })
  }

  const sortOptions = [
    { value: 'default', label: t('category.sort_default') },
    { value: 'name-asc', label: t('category.sort_name_asc') },
    { value: 'name-desc', label: t('category.sort_name_desc') },
    { value: 'price-asc', label: t('category.sort_price_asc') },
    { value: 'price-desc', label: t('category.sort_price_desc') },
  ]

  if (!categoryId && categoryId !== 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('category.not_found')}
          </h1>
          <Link href="/#planes" className="text-gray-600 hover:text-gray-900 underline">
            {t('category.back_to_plans')}
          </Link>
        </div>
      </div>
    )
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
            <Link href="/#planes" className="hover:text-gray-900 transition-colors">
              {t('plans.title')}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </nav>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-gray-600">
            {products.length} {products.length === 1 ? t('category.products_count') : t('category.products_count_plural')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{t('category.sort_by')}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  sortBy === option.value
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={sortBy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sortedProducts.map((product, index) => {
              const productName = t(`product.items.${product.id}.name`)
              const productDescription = t(`product.items.${product.id}.description`)
              const productFeatures = t(`product.items.${product.id}.features`, { returnObjects: true })
              const productSlug = getProductSlug(product.id)

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col"
                >
                  <Link href={`/producto/${productSlug}`} className="p-8 flex-1 block">
                    <div className="text-4xl mb-4">{product.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-gray-600 transition-colors">
                      {productName}
                    </h3>
                    
                    <div className="mb-4">
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

                    <p className="text-gray-600 mb-6">{productDescription}</p>

                    <ul className="space-y-3 mb-6">
                      {Array.isArray(productFeatures) && productFeatures.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                      {Array.isArray(productFeatures) && productFeatures.length > 3 && (
                        <li className="text-sm text-gray-500 ml-8">
                          +{productFeatures.length - 3} {t('category.more_features')}
                        </li>
                      )}
                    </ul>
                  </Link>

                  <div className="px-8 pb-8">
                    {product.isCustom ? (
                      <Link
                        href={`/producto/${productSlug}`}
                        className="block w-full py-3 bg-gray-900 text-white rounded-full font-medium text-center hover:bg-gray-800 transition-colors"
                      >
                        {t('category.personalize_plan')}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
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

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t('category.no_products')}</p>
            <Link href="/#planes" className="text-gray-900 underline mt-4 inline-block">
              {t('category.view_all_plans')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}