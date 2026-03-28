import { Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import OverviewPage from './pages/OverviewPage'
import KanbanPage from './pages/KanbanPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }} />
      <nav className="side-nav">
        <div className="nav-logo">PM</div>
        <Link to="/" title="Overview">🏠</Link>
        <Link to="/board" title="Kanban Board">📋</Link>
        <Link to="/admin" title="Admin">⚙️</Link>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/board" element={<KanbanPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
