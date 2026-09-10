import { Outlet } from 'react-router-dom'
import { useTrackVisit } from '../../hooks/useTrackVisit'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  useTrackVisit()

  return (
    <div className="layout">
      <Header />
      <main className="layout__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
