'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function TermsAndConditions() {
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
            Términos y Condiciones
          </h1>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                1. Aceptación de los Términos
              </h2>
              <p>
                Al acceder y utilizar el sitio web de DSYNC (dsynk.com.mx), usted acepta 
                cumplir con estos términos y condiciones. Si no está de acuerdo con alguno 
                de estos términos, le recomendamos no utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                2. Descripción del Servicio
              </h2>
              <p>
                DSYNC ofrece servicios de optimización SEO, estrategias de tráfico orgánico 
                y desarrollo de e-commerce. Nos reservamos el derecho de modificar o 
                discontinuar cualquier servicio sin previo aviso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                3. Propiedad Intelectual
              </h2>
              <p>
                Todo el contenido del sitio web, incluyendo textos, gráficos, logotipos, 
                imágenes y software, es propiedad de DSYNC y está protegido por las leyes 
                de propiedad intelectual aplicables.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                4. Pagos y Facturación
              </h2>
              <p>
                Los precios de nuestros servicios están expresados en pesos mexicanos (MXN) 
                y no incluyen IVA, a menos que se indique lo contrario. El pago debe 
                realizarse según los términos acordados en cada propuesta de servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                5. Limitación de Responsabilidad
              </h2>
              <p>
                DSYNC no será responsable por daños directos, indirectos, incidentales o 
                consecuentes que resulten del uso o la imposibilidad de usar nuestros 
                servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                6. Confidencialidad
              </h2>
              <p>
                Toda la información compartida entre el cliente y DSYNC será tratada con 
                estricta confidencialidad, de acuerdo con nuestro Aviso de Privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                7. Modificaciones
              </h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación en 
                el sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                8. Legislación Aplicable
              </h2>
              <p>
                Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. 
                Cualquier disputa será resuelta en los tribunales competentes de la 
                Ciudad de México.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                9. Contacto
              </h2>
              <p>
                Para cualquier consulta sobre estos términos, contáctenos en: 
                informes@dsynk.com
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