'use client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useCart } from '../../contexts/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { t, i18n } = useTranslation()
  const { cartItems } = useCart()
  const router = useRouter()

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    pais: 'México',
    direccion: '',
    apartamento: '',
    poblacion: '',
    region: 'Ciudad de México',
    codigoPostal: '',
    telefono: '',
    email: '',
    nombreTarjeta: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
  })

  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const formatPrice = (price) => {
    return price.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const handleChange = (e) => {
    const { name, value } = e.target
    let filteredValue = value
    
    switch(name) {
      case 'nombre':
      case 'apellido':
        filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
        break
      case 'codigoPostal':
        filteredValue = value.replace(/\D/g, '').slice(0, 5)
        break
      case 'telefono':
        filteredValue = value.replace(/\D/g, '').slice(0, 10)
        break
      case 'poblacion':
        filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
        break
      case 'nombreTarjeta':
        filteredValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase()
        break
    }
    
    setFormData(prev => ({ ...prev, [name]: filteredValue }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleNumeroTarjetaChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ')
    setFormData(prev => ({ ...prev, numeroTarjeta: formatted }))
    if (errors.numeroTarjeta) {
      setErrors(prev => ({ ...prev, numeroTarjeta: '' }))
    }
  }

  const handleFechaExpiracionChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length >= 2) {
      const mes = parseInt(value.slice(0, 2))
      if (mes > 12) value = '12' + value.slice(2)
      if (mes === 0) value = '01' + value.slice(2)
    }
    if (value.length >= 2) {
      value = value.slice(0, 2) + ' / ' + value.slice(2)
    }
    setFormData(prev => ({ ...prev, fechaExpiracion: value }))
    if (errors.fechaExpiracion) {
      setErrors(prev => ({ ...prev, fechaExpiracion: '' }))
    }
  }

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    setFormData(prev => ({ ...prev, cvv: value }))
    if (errors.cvv) {
      setErrors(prev => ({ ...prev, cvv: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) newErrors.nombre = t('checkout.validation.name_required')
    else if (formData.nombre.trim().length < 2) newErrors.nombre = t('checkout.validation.name_min')
    if (!formData.apellido.trim()) newErrors.apellido = t('checkout.validation.lastname_required')
    else if (formData.apellido.trim().length < 2) newErrors.apellido = t('checkout.validation.lastname_min')
    if (!formData.direccion.trim()) newErrors.direccion = t('checkout.validation.address_required')
    else if (formData.direccion.trim().length < 5) newErrors.direccion = t('checkout.validation.address_min')
    if (!formData.poblacion.trim()) newErrors.poblacion = t('checkout.validation.city_required')
    if (!formData.codigoPostal.trim()) newErrors.codigoPostal = t('checkout.validation.zip_required')
    else if (!/^\d{5}$/.test(formData.codigoPostal)) newErrors.codigoPostal = t('checkout.validation.zip_invalid')
    if (!formData.email.trim()) newErrors.email = t('checkout.validation.email_required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('checkout.validation.email_invalid')
    if (!formData.nombreTarjeta.trim()) newErrors.nombreTarjeta = t('checkout.validation.card_name_required')
    else if (formData.nombreTarjeta.trim().length < 3) newErrors.nombreTarjeta = t('checkout.validation.card_name_invalid')
    
    const numeroTarjetaLimpio = formData.numeroTarjeta.replace(/\s/g, '')
    if (!numeroTarjetaLimpio) newErrors.numeroTarjeta = t('checkout.validation.card_number_required')
    else if (!/^\d{16}$/.test(numeroTarjetaLimpio)) newErrors.numeroTarjeta = t('checkout.validation.card_number_invalid')

    const fechaLimpia = formData.fechaExpiracion.replace(/\D/g, '')
    if (!fechaLimpia) newErrors.fechaExpiracion = t('checkout.validation.expiry_required')
    else if (fechaLimpia.length < 4) newErrors.fechaExpiracion = t('checkout.validation.expiry_incomplete')
    else {
      const mes = parseInt(fechaLimpia.slice(0, 2))
      const año = parseInt('20' + fechaLimpia.slice(2, 4))
      const fechaActual = new Date()
      if (mes < 1 || mes > 12) newErrors.fechaExpiracion = t('checkout.validation.expiry_invalid_month')
      else if (año < fechaActual.getFullYear() || (año === fechaActual.getFullYear() && mes < fechaActual.getMonth() + 1)) {
        newErrors.fechaExpiracion = t('checkout.validation.expiry_expired')
      }
    }

    if (!formData.cvv) newErrors.cvv = t('checkout.validation.cvv_required')
    else if (formData.cvv.length < 3) newErrors.cvv = t('checkout.validation.cvv_invalid')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500')
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsProcessing(true)
    setErrors({})

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          direccion: formData.direccion,
          poblacion: formData.poblacion,
          region: formData.region,
          codigoPostal: formData.codigoPostal,
          telefono: formData.telefono,
          nombreTarjeta: formData.nombreTarjeta,
          numeroTarjeta: formData.numeroTarjeta,
          fechaExpiracion: formData.fechaExpiracion,
          cvv: formData.cvv,
          cartItems: cartItems,
          subtotal: subtotal,
          iva: iva,
          total: total,
          language: i18n.language,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || t('checkout.validation.payment_error'))

      sessionStorage.setItem('lastOrderId', data.orderId)
      sessionStorage.setItem('lastOrderTotal', formatPrice(total))
      router.push('/compra-exitosa')
    } catch (error) {
      setErrors({ general: error.message || t('checkout.validation.payment_error') })
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('checkout.empty_cart')}</h1>
          <Link href="/#planes" className="text-gray-600 hover:text-gray-900 underline">
            {t('checkout.back_to_plans')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('checkout.title')}</h1>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('checkout.your_data')}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.first_name')} *</label>
                      <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        placeholder={t('checkout.first_name')} maxLength="50" />
                      {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.last_name')} *</label>
                      <input type="text" name="apellido" value={formData.apellido} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.apellido ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        placeholder={t('checkout.last_name')} maxLength="50" />
                      {errors.apellido && <p className="mt-1 text-sm text-red-500">{errors.apellido}</p>}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.country')} *</label>
                    <select name="pais" value={formData.pais} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white">
                      <option value="México">México</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Canadá">Canadá</option>
                    </select>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.street')} *</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.direccion ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                      placeholder={t('checkout.street_placeholder')} maxLength="100" />
                    {errors.direccion && <p className="mt-1 text-sm text-red-500">{errors.direccion}</p>}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.apartment')}</label>
                    <input type="text" name="apartamento" value={formData.apartamento} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder={t('checkout.apartment_placeholder')} maxLength="50" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.city')} *</label>
                      <input type="text" name="poblacion" value={formData.poblacion} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.poblacion ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        placeholder={t('checkout.city_placeholder')} maxLength="50" />
                      {errors.poblacion && <p className="mt-1 text-sm text-red-500">{errors.poblacion}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.state')} *</label>
                      <select name="region" value={formData.region} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white">
                        <option value="Ciudad de México">Ciudad de México</option>
                        <option value="Estado de México">Estado de México</option>
                        <option value="Nuevo León">Nuevo León</option>
                        <option value="Jalisco">Jalisco</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.zip')} *</label>
                      <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.codigoPostal ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        placeholder={t('checkout.zip_placeholder')} maxLength="5" />
                      {errors.codigoPostal && <p className="mt-1 text-sm text-red-500">{errors.codigoPostal}</p>}
                      <p className="mt-1 text-xs text-gray-500">{t('checkout.zip_help')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.phone')}</label>
                      <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder={t('checkout.phone_placeholder')} maxLength="10" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.email')} *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                      placeholder={t('checkout.email_placeholder')} />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{t('checkout.card_title')}</h2>
                    <img src="/octano_logo.svg" alt="Octano Payments" className="h-10 w-auto brightness-0" />
                  </div>
                  <p className="text-gray-600 mb-6">{t('checkout.card_description')}</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.card_name')} *</label>
                      <input type="text" name="nombreTarjeta" value={formData.nombreTarjeta} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border uppercase ${errors.nombreTarjeta ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        placeholder={t('checkout.card_name_placeholder')} maxLength="50" />
                      {errors.nombreTarjeta && <p className="mt-1 text-sm text-red-500">{errors.nombreTarjeta}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.card_number')} *</label>
                      <input type="text" name="numeroTarjeta" value={formData.numeroTarjeta} onChange={handleNumeroTarjetaChange}
                        className={`w-full px-4 py-3 rounded-lg border font-mono text-lg ${errors.numeroTarjeta ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        placeholder={t('checkout.card_number_placeholder')} maxLength="19" />
                      {errors.numeroTarjeta && <p className="mt-1 text-sm text-red-500">{errors.numeroTarjeta}</p>}
                      <p className="mt-1 text-xs text-gray-500">{t('checkout.card_number_help')}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.card_expiry')} *</label>
                        <input type="text" name="fechaExpiracion" value={formData.fechaExpiracion} onChange={handleFechaExpiracionChange}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.fechaExpiracion ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                          placeholder={t('checkout.card_expiry_placeholder')} maxLength="7" />
                        {errors.fechaExpiracion && <p className="mt-1 text-sm text-red-500">{errors.fechaExpiracion}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('checkout.cvv')} *</label>
                        <input type="text" name="cvv" value={formData.cvv} onChange={handleCvvChange}
                          className={`w-full px-4 py-3 rounded-lg border font-mono ${errors.cvv ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                          placeholder={t('checkout.cvv_placeholder')} maxLength="4" />
                        {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
                        <p className="mt-1 text-xs text-gray-500">{t('checkout.cvv_help')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('checkout.your_investment')}</h2>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">× {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">${formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('checkout.subtotal')}</span>
                      <span className="font-medium">${formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('checkout.iva')}</span>
                      <span className="font-medium">${formatPrice(iva)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-lg font-bold text-gray-900">{t('checkout.total')}</span>
                      <span className="text-lg font-bold text-gray-900">${formatPrice(total)}</span>
                    </div>
                  </div>

                  <motion.button type="submit" disabled={isProcessing}
                    className="w-full mt-6 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('checkout.processing')}
                      </span>
                    ) : t('checkout.pay_now')}
                  </motion.button>

                  <p className="text-xs text-gray-500 mt-4 text-center">{t('checkout.privacy')}</p>

                  {errors.general && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                      {errors.general}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}