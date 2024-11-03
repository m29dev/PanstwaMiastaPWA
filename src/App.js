import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import RoomsPage from './pages/RoomsPage'
import GamePage from './pages/GamePage'
import UserPage from './pages/UserPage'
import RoomsIdPage from './pages/RoomsIdPage'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomsIdPage />} />
          <Route path="/rooms/:id/game" element={<GamePage />} />
          <Route path="/user/:id" element={<UserPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
