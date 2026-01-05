import { useState, useEffect } from 'react'
import api from '../services/api'
import { User } from '../types'
import './UsersScreen.css'

const UsersScreen = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки пользователей')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.')) {
      return
    }

    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(users.filter((u) => u.id !== userId))
      if (selectedUser?.id === userId) {
        setSelectedUser(null)
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления пользователя')
    }
  }

  if (loading) {
    return <div className="loading">Загрузка пользователей...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="users-screen">
      <div className="screen-header">
        <h1>Пользователи</h1>
        <button onClick={loadUsers} className="refresh-button">
          🔄 Обновить
        </button>
      </div>

      <div className="users-container">
        <div className="users-list">
          <div className="table-header">
            <div className="col-id">ID</div>
            <div className="col-name">Имя</div>
            <div className="col-email">Email</div>
            <div className="col-phone">Телефон</div>
            <div className="col-city">Город</div>
            <div className="col-created">Создан</div>
            <div className="col-actions">Действия</div>
          </div>
          {users.length === 0 ? (
            <div className="empty-state">Пользователи не найдены</div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="table-row">
                <div className="col-id">{user.id}</div>
                <div className="col-name" onClick={() => setSelectedUser(user)}>
                  {user.name}
                </div>
                <div className="col-email">{user.email}</div>
                <div className="col-phone">{user.phone || '-'}</div>
                <div className="col-city">{user.city || '-'}</div>
                <div className="col-created">
                  {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </div>
                <div className="col-actions">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="btn-view"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedUser && (
          <div className="user-details">
            <div className="details-header">
              <h2>{selectedUser.name}</h2>
              <button onClick={() => setSelectedUser(null)} className="close-button">
                ✕
              </button>
            </div>
            <div className="details-content">
              {selectedUser.photo && (
                <div className="user-photo">
                  <img src={selectedUser.photo} alt={selectedUser.name} />
                </div>
              )}
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Телефон:</strong> {selectedUser.phone || 'Не указан'}</p>
              <p><strong>Город:</strong> {selectedUser.city || 'Не указан'}</p>
              <p><strong>Создан:</strong> {new Date(selectedUser.createdAt).toLocaleString('ru-RU')}</p>
              <p><strong>Обновлен:</strong> {new Date(selectedUser.updatedAt).toLocaleString('ru-RU')}</p>
            </div>
            <div className="details-actions">
              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="btn-delete-large"
              >
                Удалить пользователя
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersScreen

