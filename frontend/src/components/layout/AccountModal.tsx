import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../ui/Modal'
import { useAuth } from '../../app/AuthProvider'
import { useTheme, type Theme } from '../../app/ThemeProvider'

interface AccountModalProps {
  open: boolean
  onClose: () => void
}

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
  { value: 'system', label: 'Системная' },
]

export function AccountModal({ open, onClose }: AccountModalProps) {
  const { user, logout, uploadAvatar } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  if (!user) return null

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadAvatar(file)
    } finally {
      setUploading(false)
    }
  }

  async function handleLogout() {
    await logout()
    onClose()
    navigate('/')
  }

  return (
    <Modal open={open} onClose={onClose} title="Личный кабинет">
      <div className="account-modal">
        <div className="account-modal__avatar-row">
          <button
            type="button"
            className="account-modal__avatar"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <span>{user.username.slice(0, 2).toUpperCase()}</span>
            )}
          </button>
          <div>
            <p className="account-modal__name">{user.first_name || user.username}</p>
            <button
              type="button"
              className="account-modal__upload-link"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Загружаем...' : 'Загрузить фото'}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>

        <div className="account-modal__section">
          <h3>Тема сайта</h3>
          <div className="account-modal__theme-options">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  theme === option.value
                    ? 'account-modal__theme-btn account-modal__theme-btn--active'
                    : 'account-modal__theme-btn'
                }
                onClick={() => setTheme(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {user.is_staff && (
          <div className="account-modal__section">
            <h3>Менеджеру</h3>
            <button
              type="button"
              className="account-modal__link-btn"
              onClick={() => {
                onClose()
                navigate('/stats')
              }}
            >
              Статистика посещений
            </button>
          </div>
        )}

        <button type="button" className="account-modal__logout" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </div>
    </Modal>
  )
}
