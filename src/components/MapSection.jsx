'use client'
import React from 'react'
import { motion } from 'framer-motion'

const MapSection = () => {
  const address = "CALLE MONTE ELBRUZ 124, LOMAS DE CHAPULTEPEC, 11000 CIUDAD DE MÉXICO, CDMX"
  const encodedAddress = encodeURIComponent(address)
  
  return (
    <section className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full"
        style={{ height: '50vw', maxHeight: '600px', minHeight: '400px' }}
      >
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=-99.2200%2C19.4200%2C-99.1800%2C19.4400&layer=mapnik&marker=19.4300%2C-99.2000`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="DSYNC Location"
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />
      </motion.div>
      
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