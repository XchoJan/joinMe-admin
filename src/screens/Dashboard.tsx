import { Routes, Route, NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import EventsScreen from './EventsScreen'
import UsersScreen from './UsersScreen'
import ChatsScreen from './ChatsScreen'
import StatisticsScreen from './StatisticsScreen'
import './Dashboard.css'

const Dashboard = () => {
  const { logout } = useContext(AuthContext)

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>JoinMe Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/events" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📅 Все события
          </NavLink>
          <NavLink to="/dashboard/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            👥 Пользователи
          </NavLink>
          <NavLink to="/dashboard/chats" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            💬 Чаты
          </NavLink>
          <NavLink to="/dashboard/statistics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📊 Статистика
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={logout} className="logout-button">
            Выйти
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="events" element={<EventsScreen />} />
          <Route path="users" element={<UsersScreen />} />
          <Route path="chats" element={<ChatsScreen />} />
          <Route path="statistics" element={<StatisticsScreen />} />
          <Route path="/" element={<EventsScreen />} />
        </Routes>
      </main>
    </div>
  )
}

export default Dashboard

