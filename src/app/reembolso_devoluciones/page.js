'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function RefundPolicy() {
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
            Política de Devoluciones y Reembolsos
          </h1>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                1. Servicios Digitales
              </h2>
              <p>
                Debido a la naturaleza digital de nuestros servicios de SEO, consultoría 
                y desarrollo web, una vez iniciado el servicio, no se aceptan devoluciones 
                totales. Sin embargo, nos comprometemos a trabajar con usted hasta alcanzar 
                los objetivos acordados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                2. Garantía de Satisfacción
              </h2>
              <p>
                En DSYNC nos esforzamos por garantizar la satisfacción total de nuestros 
                clientes. Si no está satisfecho con los resultados iniciales, trabajaremos 
                en revisiones y ajustes sin costo adicional durante el período acordado 
                en su propuesta de servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                3. Cancelación de Servicios
              </h2>
              <p>
                Los servicios pueden ser cancelados en cualquier momento. La cancelación 
                debe ser notificada por escrito al correo electrónico: informes@dsynk.com. 
                Se facturará únicamente el trabajo realizado hasta el momento de la 
                cancelación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                4. Reembolsos Parciales
              </h2>
              <p>
                Los reembolsos parciales se evaluarán caso por caso bajo las siguientes 
                circunstancias:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Servicios no iniciados: reembolso del 100%</li>
                <li>Servicios parcialmente completados: reembolso proporcional</li>
                <li>Incumplimiento de plazos por parte de DSYNC: reembolso según acuerdo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                5. Proceso de Reembolso
              </h2>
              <p>
                Para solicitar un reembolso, debe:
              </p>
              <ol className="list-decimal pl-6 mt-2">
                <li>Enviar un correo a informes@dsynk.com</li>
                <li>Incluir el número de factura o comprobante de pago</li>
                <li>Explicar el motivo de la solicitud</li>
                <li>Recibirá una respuesta en un plazo máximo de 5 días hábiles</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                6. Tiempos de Reembolso
              </h2>
              <p>
                Una vez aprobado el reembolso, el tiempo de procesamiento dependerá del 
                método de pago utilizado:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Tarjeta de crédito/débito: 5 a 15 días hábiles</li>
                <li>Transferencia bancaria: 3 a 5 días hábiles</li>
                <li>Otros métodos: según los términos del proveedor de pago</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                7. Excepciones
              </h2>
              <p>
                No se realizarán reembolsos en los siguientes casos:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Servicios completados y entregados según lo acordado</li>
                <li>Cambios en los requerimientos del cliente después de iniciado el servicio</li>
                <li>Falta de colaboración del cliente que impida la correcta ejecución del servicio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                8. Contacto para Reembolsos
              </h2>
              <p>
                Para cualquier consulta sobre nuestra política de devoluciones y reembolsos, 
                contáctenos en: informes@dsynk.com
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