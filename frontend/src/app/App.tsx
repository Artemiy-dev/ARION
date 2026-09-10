import { RouterProvider } from 'react-router-dom'
import { Preloader } from '../components/layout/Preloader'
import { AuthProvider } from './AuthProvider'
import { CartProvider } from './CartProvider'
import { FavoritesProvider } from './FavoritesProvider'
import { ThemeProvider } from './ThemeProvider'
import { router } from './routes'

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Preloader />
            <RouterProvider router={router} />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
