'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

const Footer = () => {
  const { t } = useTranslation()
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
            <img src="/logo.svg" alt="DSYNK" className="h-16 w-auto brightness-0 invert" />
          </div>

          {/* Dirección */}
          <div className="text-center text-gray-300">
            <p className="text-sm leading-relaxed">{t('footer.address')}</p>
          </div>

          {/* Contacto y métodos de pago */}
          <div className="text-center md:text-right space-y-4">
            {/* Contacto */}
            <div className="space-y-2">
              <a 
                href="mailto:informes@dsynk.com.mx" 
                className="flex items-center justify-center md:justify-end space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{t('footer.email')}</span>
              </a>
              <a 
                href="tel:+525598341166" 
                className="flex items-center justify-center md:justify-end space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{t('footer.phone')}</span>
              </a>
            </div>

            {/* Métodos de pago */}
            <div className="flex items-center justify-center md:justify-end space-x-4">
              <img src="/visa.svg" alt="Visa" className="h-8 w-auto brightness-0 invert" />
              <img src="/mastercard.svg" alt="Mastercard" className="h-8 w-auto brightness-0 invert" />
            </div>
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
              &copy; {currentYear} DSYNK. {t('footer.rights')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer