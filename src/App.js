import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import RoomsPage from './pages/RoomsPage'
import GamePage from './pages/GamePage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/game/:id" element={<GamePage />} />
      </Routes>
    </Router>
  )
}

export default App
