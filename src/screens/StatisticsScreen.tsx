import { useState, useEffect } from 'react'
import api from '../services/api'
import './StatisticsScreen.css'

interface AnalyticsStats {
  total: {
    userCreated: number
    eventCreated: number
    eventRequests: number
  }
  daily: {
    date: string
    userCreated: number
    eventCreated: number
    eventRequests: number
  }[]
}

interface Statistics {
  totalUsers: number
  totalEvents: number
  totalChats: number
  totalMessages: number
  activeEvents: number
  pendingRequests: number
  eventsByCity: { city: string; count: number }[]
  recentUsers: { date: string; count: number }[]
  analytics?: AnalyticsStats
}

const StatisticsScreen = () => {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/statistics')
      setStats(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки статистики')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Загрузка статистики...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!stats) {
    return <div className="error">Данные не найдены</div>
  }

  return (
    <div className="statistics-screen">
      <div className="screen-header">
        <h1>Статистика</h1>
        <button onClick={loadStatistics} className="refresh-button">
          🔄 Обновить
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Всего пользователей</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.totalEvents}</div>
          <div className="stat-label">Всего событий</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-value">{stats.totalChats}</div>
          <div className="stat-label">Всего чатов</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-value">{stats.totalMessages}</div>
          <div className="stat-label">Всего сообщений</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.activeEvents}</div>
          <div className="stat-label">Активных событий</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{stats.pendingRequests}</div>
          <div className="stat-label">Ожидающих заявок</div>
        </div>
      </div>

      {stats.analytics && (
        <div className="analytics-section">
          <h2>Активность в приложении</h2>
          <div className="stats-grid">
            <div className="stat-card analytics-card">
              <div className="stat-icon">👤</div>
              <div className="stat-value">{stats.analytics.total.userCreated}</div>
              <div className="stat-label">Новых пользователей</div>
            </div>

            <div className="stat-card analytics-card">
              <div className="stat-icon">📅</div>
              <div className="stat-value">{stats.analytics.total.eventCreated}</div>
              <div className="stat-label">Созданных событий</div>
            </div>

            <div className="stat-card analytics-card">
              <div className="stat-icon">✋</div>
              <div className="stat-value">{stats.analytics.total.eventRequests}</div>
              <div className="stat-label">Откликов на события</div>
            </div>
          </div>

          <div className="stats-section">
            <h3>Активность по дням (последние 30 дней)</h3>
            <div className="daily-stats">
              {stats.analytics.daily.length === 0 ? (
                <div className="empty-state">Нет данных</div>
              ) : (
                <div className="daily-stats-table">
                  <div className="daily-stats-header">
                    <div className="daily-stat-col">Дата</div>
                    <div className="daily-stat-col">Новые пользователи</div>
                    <div className="daily-stat-col">Созданные события</div>
                    <div className="daily-stat-col">Отклики</div>
                  </div>
                  {stats.analytics.daily.map((item, index) => (
                    <div key={index} className="daily-stats-row">
                      <div className="daily-stat-col">
                        {new Date(item.date).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="daily-stat-col">{item.userCreated}</div>
                      <div className="daily-stat-col">{item.eventCreated}</div>
                      <div className="daily-stat-col">{item.eventRequests}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="stats-sections">
        <div className="stats-section">
          <h2>События по городам</h2>
          <div className="city-stats">
            {stats.eventsByCity.length === 0 ? (
              <div className="empty-state">Нет данных</div>
            ) : (
              stats.eventsByCity.map((item, index) => (
                <div key={index} className="city-stat-item">
                  <span className="city-name">{item.city || 'Не указан'}</span>
                  <span className="city-count">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="stats-section">
          <h2>Новые пользователи (последние 7 дней)</h2>
          <div className="recent-users">
            {stats.recentUsers.length === 0 ? (
              <div className="empty-state">Нет данных</div>
            ) : (
              stats.recentUsers.map((item, index) => (
                <div key={index} className="recent-user-item">
                  <span className="user-date">{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                  <span className="user-count">{item.count} пользователей</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsScreen

