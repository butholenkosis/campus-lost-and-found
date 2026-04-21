import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import NewListing from './pages/NewListing'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="listings" element={<Listings />} />
          <Route path="listings/:id" element={<ListingDetail />} />
          <Route path="new" element={<NewListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
