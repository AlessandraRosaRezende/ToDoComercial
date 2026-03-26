import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './lib/UserContext'
import { Dashboard } from './pages/Dashboard'
import { ProjectDetail } from './pages/ProjectDetail'
import './index.css'

const root = document.getElementById('root')

if (!root) {
  document.body.innerHTML = '<h1 style="color:red;padding:20px">Erro: elemento #root não encontrado</h1>'
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </React.StrictMode>,
  )
}