import { useState, useEffect } from 'react'
import api from '../services/api'
import { Chat } from '../types'
import { shortenId } from '../utils/formatId'
import './ChatsScreen.css'

const ChatsScreen = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/chats')
      setChats(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки чатов')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteChat = async (chatId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот чат? Все сообщения будут удалены.')) {
      return
    }

    try {
      await api.delete(`/admin/chats/${chatId}`)
      setChats(chats.filter((c) => c.id !== chatId))
      if (selectedChat?.id === chatId) {
        setSelectedChat(null)
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления чата')
    }
  }

  if (loading) {
    return <div className="loading">Загрузка чатов...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="chats-screen">
      <div className="screen-header">
        <h1>Чаты</h1>
        <button onClick={loadChats} className="refresh-button">
          🔄 Обновить
        </button>
      </div>

      <div className="chats-container">
        <div className="chats-list">
          <div className="table-header">
            <div className="col-id">ID</div>
            <div className="col-event">Событие</div>
            <div className="col-messages">Сообщений</div>
            <div className="col-created">Создан</div>
            <div className="col-actions">Действия</div>
          </div>
          {chats.length === 0 ? (
            <div className="empty-state">Чаты не найдены</div>
          ) : (
            chats.map((chat) => (
              <div key={chat.id} className="table-row">
                <div className="col-id">{shortenId(chat.id)}</div>
                <div className="col-event" onClick={() => setSelectedChat(chat)}>
                  {chat.event?.title || `Событие ID: ${chat.eventId}`}
                </div>
                <div className="col-messages">{chat.messages?.length || 0}</div>
                <div className="col-created">
                  {new Date(chat.createdAt).toLocaleDateString('ru-RU')}
                </div>
                <div className="col-actions">
                  <button
                    onClick={() => setSelectedChat(chat)}
                    className="btn-view"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedChat && (
          <div className="chat-details">
            <div className="details-header">
              <h2>Чат #{selectedChat.id}</h2>
              <button onClick={() => setSelectedChat(null)} className="close-button">
                ✕
              </button>
            </div>
            <div className="details-content">
              <p><strong>Событие:</strong> {selectedChat.event?.title || `ID: ${selectedChat.eventId}`}</p>
              <p><strong>Количество сообщений:</strong> {selectedChat.messages?.length || 0}</p>
              <p><strong>Создан:</strong> {new Date(selectedChat.createdAt).toLocaleString('ru-RU')}</p>
              {selectedChat.messages && selectedChat.messages.length > 0 && (
                <div className="messages-list">
                  <strong>Сообщения:</strong>
                  <div className="messages-container">
                    {selectedChat.messages.map((message) => (
                      <div key={message.id} className="message-item">
                        <div className="message-header">
                          <span className="message-user">{message.user?.name || `ID: ${message.userId}`}</span>
                          <span className="message-time">
                            {new Date(message.createdAt).toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div className="message-text">{message.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="details-actions">
              <button
                onClick={() => handleDeleteChat(selectedChat.id)}
                className="btn-delete-large"
              >
                Удалить чат
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatsScreen

