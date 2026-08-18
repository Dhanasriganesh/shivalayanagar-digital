import { useEffect } from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import Routers from '../routers/Routers'
import { LanguageProvider } from '../../context/LanguageContext'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function Shell() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin-san')
  const isGrievances = pathname.startsWith('/grievances')
  const isStatus = pathname.startsWith('/status') || pathname.startsWith('/ack')

  return (
    <div
      className={`flex min-h-dvh flex-col ${
        isGrievances ? 'page-grievances' : isStatus ? 'page-status' : ''
      }`}
    >
      {isAdmin ? null : <Header />}
      <main
        className={`mx-auto w-full flex-1 px-4 py-4 sm:px-5 sm:py-6 ${
          isAdmin ? 'max-w-6xl py-5' : 'max-w-lg'
        }`}
      >
        <Routers />
      </main>
      {isAdmin ? null : <Footer />}
    </div>
  )
}

function Layout() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Shell />
      </Router>
    </LanguageProvider>
  )
}

export default Layout
