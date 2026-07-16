'use client'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiX } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import LanguageSwitcher from './LanguageSwitcher'
import CartSidebar from './CartSidebar'
import Link from 'next/link'

const Header = () => {
  const { t } = useTranslation()
  const { isCartOpen, setIsCartOpen, getTotal, getItemCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
  { label: t('header.who_we_are'), href: '/#quienessomos' },
  { label: t('header.why_choose_us'), href: '/#porqueelegirnos' },
  { label: t('header.plans'), href: '/#planes' },
]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.svg" alt="DSYNC" className="h-12 w-auto" />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </motion.a>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {/* Cart Button */}
              <Link href="/carrito" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  <FiShoppingCart className="w-6 h-6" />
                  <span className="ml-2 font-medium hidden sm:inline">
                    ${getTotal().toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {getItemCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {getItemCount()}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* CTA Button */}
              <motion.a
                href="/#contactanos"
                className="hidden lg:inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('header.connect_with_us')}
              </motion.a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t"
            >
              <div className="px-4 py-4 space-y-3">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  href="/carrito"
                  className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Carrito ({getItemCount()})
                </Link>
                <a
                  href="/#contactanos"
                  className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-full font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.connect_with_us')}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartSidebar />
    </>
  )
}

export default Header