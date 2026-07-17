'use client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

const MapSection = () => {
  const { t } = useTranslation()
  const [showTooltip, setShowTooltip] = useState(true)
  const address = "CALLE MONTE ELBRUZ 124, LOMAS DE CHAPULTEPEC, 11000 CIUDAD DE MÉXICO, CDMX"

  const handleMapInteraction = () => {
    setShowTooltip(false)
  }

  return (
    <section className="w-full relative">
      <div 
        className="relative w-full overflow-hidden" 
        style={{ height: '50vw', maxHeight: '600px', minHeight: '400px' }}
      >
        <div 
          className="absolute inset-0 z-10"
          onMouseDown={handleMapInteraction}
          onWheel={handleMapInteraction}
          onTouchStart={handleMapInteraction}
        />

        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-99.2200%2C19.4200%2C-99.1800%2C19.4400&layer=mapnik&marker=19.4300%2C-99.2000"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="DSYNC Location"
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute z-20"
              style={{
                top: '42%',
                left: '52%',
                transform: 'translate(0, -50%)',
              }}
            >
              <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-64">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowTooltip(false)
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg"
                  title={t('map.close')}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 mb-1">📍 {t('map.company_name')}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    CALLE MONTE ELBRUZ, N°. 124
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    PISO 2, INT 212 B
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    COL. LOMAS DE CHAPULTEPEC III SECC
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    C.P. 11000, CIUDAD DE MÉXICO
                  </p>
                </div>

                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!showTooltip && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={(e) => {
                e.stopPropagation()
                setShowTooltip(true)
              }}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
              title={t('map.show_address')}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <div className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium">DSYNC</p>
          <p className="text-sm text-gray-400 mt-1">{address}</p>
        </div>
      </div>
    </section>
  )
}

export default MapSection