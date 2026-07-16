'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function PrivacyNotice() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-lg p-8 sm:p-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            Aviso de Privacidad
          </h1>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                1. Identidad del Responsable
              </h2>
              <p>
                DSYNC, con domicilio en CALLE MONTE ELBRUZ, N°. 124, PISO 2, INT 212 B, 
                COL. LOMAS DE CHAPULTEPEC III SECC, ALCALDÍA MIGUEL HIDALGO, 
                C.P. 11000, CIUDAD DE MÉXICO, es el responsable del tratamiento de los 
                datos personales que nos proporcione.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                2. Datos Personales Recabados
              </h2>
              <p>
                Recabamos los siguientes datos personales:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Nombre de la empresa</li>
                <li>Información relacionada con los servicios solicitados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                3. Finalidad del Tratamiento
              </h2>
              <p>
                Los datos personales serán utilizados para las siguientes finalidades:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Proveer los servicios y productos solicitados</li>
                <li>Enviar comunicaciones sobre nuestros servicios</li>
                <li>Atender consultas y solicitudes de información</li>
                <li>Enviar cotizaciones y propuestas de servicio</li>
                <li>Dar seguimiento a las relaciones comerciales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                4. Transferencia de Datos
              </h2>
              <p>
                DSYNC se compromete a no transferir sus datos personales a terceros 
                sin su consentimiento, salvo las excepciones previstas en la ley.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                5. Derechos ARCO
              </h2>
              <p>
                Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al 
                tratamiento de sus datos personales (Derechos ARCO). Para ejercer 
                estos derechos, puede enviar una solicitud al correo electrónico: 
                informes@dsynk.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                6. Cambios al Aviso de Privacidad
              </h2>
              <p>
                Nos reservamos el derecho de efectuar en cualquier momento 
                modificaciones o actualizaciones al presente aviso de privacidad. 
                Cualquier cambio será notificado a través de nuestro sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                7. Contacto
              </h2>
              <p>
                Si tiene alguna duda sobre este aviso de privacidad, puede contactarnos 
                en: informes@dsynk.com
              </p>
            </section>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Última actualización: {new Date().toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}