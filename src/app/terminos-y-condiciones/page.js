'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function TermsAndConditions() {
  const { t } = useTranslation()

  const sections = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-lg p-8 sm:p-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            {t('terms.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">{t('terms.company')}</p>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            {sections.map((sectionNum) => {
              const section = t(`terms.sections.${sectionNum}`, { returnObjects: true })
              const keys = Object.keys(section).filter(k => k !== 'title')
              
              return (
                <section key={sectionNum}>
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {sectionNum}. {section.title}
                  </h2>
                  {keys.map((key) => (
                    <p key={key} className="mb-3">
                      {section[key]}
                    </p>
                  ))}
                </section>
              )
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t('terms.last_update')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}