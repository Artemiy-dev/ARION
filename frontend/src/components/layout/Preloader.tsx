import { useEffect, useState } from 'react'
import { useAuth } from '../../app/AuthProvider'

const MIN_VISIBLE_MS = 700
const FADE_OUT_MS = 400

export function Preloader() {
  const { loading: authLoading } = useAuth()
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [])

  const ready = !authLoading && minTimeElapsed

  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => setRemoved(true), FADE_OUT_MS)
    return () => clearTimeout(timer)
  }, [ready])

  if (removed) return null

  return (
    <div className={`preloader ${ready ? 'preloader--hidden' : ''}`} aria-hidden={ready}>
      <div className="preloader__logo">ARION</div>
      <div className="preloader__loading">
        <span className="preloader__dots">
          <span className="preloader__dot" />
          <span className="preloader__dot" />
          <span className="preloader__dot" />
        </span>
        Загрузка
      </div>
    </div>
  )
}
