import { useState, useEffect } from 'react'
import api from '../services/api'
import { Event } from '../types'
import './EventsScreen.css'

const EventsScreen = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/events')
      setEvents(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки событий')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить это событие?')) {
      return
    }

    try {
      await api.delete(`/admin/events/${eventId}`)
      setEvents(events.filter((e) => e.id !== eventId))
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null)
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления события')
    }
  }

  if (loading) {
    return <div className="loading">Загрузка событий...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="events-screen">
      <div className="screen-header">
        <h1>Все события</h1>
        <button onClick={loadEvents} className="refresh-button">
          🔄 Обновить
        </button>
      </div>

      <div className="events-container">
        <div className="events-list">
          <div className="table-header">
            <div className="col-id">ID</div>
            <div className="col-title">Название</div>
            <div className="col-author">Автор</div>
            <div className="col-date">Дата</div>
            <div className="col-city">Город</div>
            <div className="col-participants">Участники</div>
            <div className="col-actions">Действия</div>
          </div>
          {events.length === 0 ? (
            <div className="empty-state">События не найдены</div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="table-row">
                <div className="col-id">{event.id}</div>
                <div className="col-title" onClick={() => setSelectedEvent(event)}>
                  {event.title}
                </div>
                <div className="col-author">
                  {event.author?.name || `ID: ${event.authorId}`}
                </div>
                <div className="col-date">
                  {new Date(event.date).toLocaleDateString('ru-RU')} {event.time}
                </div>
                <div className="col-city">{event.city}</div>
                <div className="col-participants">
                  {event.participants?.length || 0} / {event.participantLimit}
                </div>
                <div className="col-actions">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="btn-view"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedEvent && (
          <div className="event-details">
            <div className="details-header">
              <h2>{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)} className="close-button">
                ✕
              </button>
            </div>
            <div className="details-content">
              <p><strong>Описание:</strong> {selectedEvent.description}</p>
              <p><strong>Дата:</strong> {new Date(selectedEvent.date).toLocaleDateString('ru-RU')}</p>
              <p><strong>Время:</strong> {selectedEvent.time}</p>
              <p><strong>Место:</strong> {selectedEvent.location}</p>
              <p><strong>Город:</strong> {selectedEvent.city}</p>
              <p><strong>Лимит участников:</strong> {selectedEvent.participantLimit}</p>
              <p><strong>Автор:</strong> {selectedEvent.author?.name} ({selectedEvent.author?.email})</p>
              <p><strong>Участников:</strong> {selectedEvent.participants?.length || 0}</p>
              {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                <div>
                  <strong>Список участников:</strong>
                  <ul>
                    {selectedEvent.participants.map((p) => (
                      <li key={p.id}>{p.name} ({p.email})</li>
                    ))}
                  </ul>
                </div>
              )}
              <p><strong>Создано:</strong> {new Date(selectedEvent.createdAt).toLocaleString('ru-RU')}</p>
            </div>
            <div className="details-actions">
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="btn-delete-large"
              >
                Удалить событие
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsScreen

