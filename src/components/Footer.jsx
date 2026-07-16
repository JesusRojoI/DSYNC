'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

const Footer = () => {
  const { t, i18n } = useTranslation()
  const currentYear = new Date().getFullYear()

  const legalLinks = [
    { 
      label: t('footer.privacy_notice'),
      href: '/aviso-de-privacidad'
    },
    { 
      label: t('footer.terms_conditions'),
      href: '/terminos-y-condiciones'
    },
    { 
      label: t('footer.refund_policy'),
      href: '/reembolso_devoluciones'
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <img src="/logo.svg" alt="DSYNC" className="h-16 w-auto brightness-0 invert" />
          </div>

          {/* Address */}
          <div className="text-center text-gray-300">
            <p className="text-sm leading-relaxed">{t('footer.address')}</p>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center justify-center md:justify-end space-x-4">
            <img src="/visa.svg" alt="Visa" className="h-8 w-auto brightness-0 invert" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-8 w-auto brightness-0 invert" />
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
            {legalLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
                {index < legalLinks.length - 1 && (
                  <span className="text-gray-600 hidden sm:inline">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} DSYNC. {t('footer.rights')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer