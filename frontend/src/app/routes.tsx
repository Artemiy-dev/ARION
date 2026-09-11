import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { AboutPage } from '../pages/AboutPage'
import { CartPage } from '../pages/CartPage'
import { CatalogPage } from '../pages/CatalogPage'
import { ComparePage } from '../pages/ComparePage'
import { ContactsPage } from '../pages/ContactsPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProductPage } from '../pages/ProductPage'
import { RegisterPage } from '../pages/RegisterPage'
import { StatsPage } from '../pages/StatsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'product/:slug', element: <ProductPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'stats', element: <StatsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
