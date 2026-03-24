"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/molecules/Navbar"
import { Footer } from "./components/molecules/Footer"
import { HomePage } from "./react-pages/HomePage"
import { ActualidadPage } from "./react-pages/ActualidadPage"
import { NewsDetailPage } from "./react-pages/NewsDetailPage"
import { SolicitudesPage } from "./react-pages/SolicitudesPage"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            
            <Route path="/" element={<HomePage />} />
            <Route path="/actualidad" element={<ActualidadPage />} />
            <Route path="/actualidad/:id" element={<NewsDetailPage />} />
            <Route path="/solicitudes" element={<SolicitudesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
