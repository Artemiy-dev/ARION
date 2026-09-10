import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../api/client'

export function useTrackVisit() {
  const location = useLocation()

  useEffect(() => {
    api.post('/analytics/visit/', { path: location.pathname }).catch(() => {})
  }, [location.pathname])
}
