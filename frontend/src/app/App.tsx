import { RouterProvider } from 'react-router-dom'
import { Preloader } from '../components/layout/Preloader'
import { AuthProvider } from './AuthProvider'
import { CartProvider } from './CartProvider'
import { CompareProvider } from './CompareProvider'
import { FavoritesProvider } from './FavoritesProvider'
import { ThemeProvider } from './ThemeProvider'
import { router } from './routes'

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <CompareProvider>
              <Preloader />
              <RouterProvider router={router} />
            </CompareProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
