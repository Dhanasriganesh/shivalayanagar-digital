import { useEffect } from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import Routers from '../routers/Routers'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function Layout() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5 sm:px-5 sm:py-7">
          <Routers />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default Layout
