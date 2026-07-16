'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
  }

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {i18n.language === 'es' ? (
        <img
          src="https://flagcdn.com/mx.svg"
          alt="Español"
          className="w-8 h-6 rounded shadow-sm"
        />
      ) : (
        <img
          src="https://flagcdn.com/us.svg"
          alt="English"
          className="w-8 h-6 rounded shadow-sm"
        />
      )}
    </motion.button>
  )
}

export default LanguageSwitcher