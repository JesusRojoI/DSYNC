import './globals.css'
import { CartProvider } from '../contexts/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import I18nProvider from '../components/I18nProvider'

export const metadata = {
  title: 'DSYNC - Tráfico Orgánico para E-commerce',
  description: 'Despega tu e-commerce con tráfico orgánico que sí vende. Atrae clientes reales desde Google y convierte tu tienda en un canal de ventas constante.',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <I18nProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </I18nProvider>
        </CartProvider>
      </body>
    </html>
  )
}