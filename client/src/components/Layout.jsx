import { Outlet, NavLink, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <nav className="nav">
        <Link to="/" className="nav-logo">
          🎒 Campus<span>L&F</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/listings">Browse</NavLink>
          <NavLink to="/new" className="nav-cta">+ Report Item</NavLink>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        Campus Lost &amp; Found — helping students reconnect with their belongings <span>♥</span>
      </footer>
    </>
  )
}
