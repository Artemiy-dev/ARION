import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import type { Banner } from '../../types/banner'

const AUTOPLAY_MS = 5000

export function PromoCarousel() {
  const { data: banners } = useFetch<Banner[]>('/banners/')
  const [index, setIndex] = useState(0)

  const count = banners?.length ?? 0

  useEffect(() => {
    if (count < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [count, index])

  if (!banners || banners.length === 0) return null

  const safeIndex = index % banners.length

  function goTo(i: number) {
    setIndex((i + banners!.length) % banners!.length)
  }

  function renderSlide(banner: Banner) {
    const image = <img className="promo-carousel__image" src={banner.image} alt={banner.title} />
    if (!banner.link) return image
    if (banner.link.startsWith('http')) {
      return (
        <a href={banner.link} target="_blank" rel="noopener noreferrer">
          {image}
        </a>
      )
    }
    return <Link to={banner.link}>{image}</Link>
  }

  return (
    <div className="promo-carousel">
      <div className="promo-carousel__viewport">
        <div
          className="promo-carousel__track"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div className="promo-carousel__slide" key={banner.id}>
              {renderSlide(banner)}
            </div>
          ))}
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              className="promo-carousel__arrow promo-carousel__arrow--prev"
              onClick={() => goTo(safeIndex - 1)}
              aria-label="Предыдущий баннер"
            >
              ‹
            </button>
            <button
              type="button"
              className="promo-carousel__arrow promo-carousel__arrow--next"
              onClick={() => goTo(safeIndex + 1)}
              aria-label="Следующий баннер"
            >
              ›
            </button>
          </>
        )}
      </div>

      {banners.length > 1 && (
        <div className="promo-carousel__dots">
          {banners.map((banner, i) => (
            <button
              type="button"
              key={banner.id}
              className={
                i === safeIndex ? 'promo-carousel__dot promo-carousel__dot--active' : 'promo-carousel__dot'
              }
              onClick={() => goTo(i)}
              aria-label={`Баннер ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
