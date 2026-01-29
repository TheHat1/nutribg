import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import WelcomePage from "./Pages/WelcomePage"
import RecepiesPage from "./Pages/RecipesPage"
import LogIn from "./Pages/LogIn"
import SignUp from "./Pages/SignUp"
import ProfilePage from "./Pages/ProfilePage"
import FavoritesPage from "./Pages/FavoritesPage.jsx"
import RecipePage from './Pages/RecipePage.jsx'
import { useEffect, useState } from "react"
import isAuth from './Backend/isAuth.js'

function App() {
  const navigate = useNavigate()
  const address = useLocation()
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700)
  const [isMenuOPen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    async function func() {
      setIsSignedIn(await isAuth())
    }
    func()
  }, [address])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {isMobile ?
        <div className="w-full h-28 bg-lime-900 z-10 flex items-center p-3 fixed top-0 shadow-2xl pr-6">
          <img onClick={() => { navigate('/') }} className="h-20 cursor-pointer" src="/images/nutri-bg-logo.png" />
          <img onClick={() => setIsMenuOpen(!isMenuOPen)} className="h-10 invert cursor-pointer ml-auto" src="/images/hamburger.png" />
          <div className={`absolute top-25 left-0 flex flex-col h-40 bg-lime-600 transition-all duration-300 w-full justify-center items-center space-y-4 py-3 
            ${isMenuOPen ? 'visible opacity-100 translate-y-3' : 'opacity-0 invisible'}`}>
            <div onClick={() => { navigate('/recipes'); setIsMenuOpen(false) }} className="w-full flex items-center justify-center border-b border-green-900 cursor-pointer transition-all hover:scale-110 ease-in-out hover:brightness-80 space-x-1">
              <h1 className="text-white text-lg font-display">Рецепти</h1>
            </div>
            <div onClick={() => { navigate('/favorites'); setIsMenuOpen(false) }} className="w-full flex items-center justify-center border-b border-green-900 cursor-pointer transition-all hover:scale-110 ease-in-out hover:brightness-80 space-x-1">
              <h1 className="text-white text-lg font-display">Запазени</h1>
              <img className="h-9 invert" src="/images/bookmark.png" />
            </div>
            <div onClick={() => { isSignedIn ? navigate('/profilepage') : navigate('/login'); setIsMenuOpen(false) }}
              className="flex items-center cursor-pointer transition-all hover:scale-110 ease-in-out hover:brightness-80 space-x-2">
              <h1 className="text-white text-lg font-display">Профил</h1>
              <img className="h-10 invert" src="/images/user.png" />
            </div>
          </div>
        </div>
        :
        <div className="w-full h-28 bg-lime-900 z-10 flex items-center p-3 fixed top-0 shadow-2xl pr-5">
          <img onClick={() => { navigate('/') }} className="h-22 cursor-pointer" src="/images/nutri-bg-logo.png" />
          <div className="w-full flex justify-end items-center space-x-8">
            <div onClick={() => { navigate('/recipes') }} className="flex items-center cursor-pointer transition-all hover:scale-110 ease-in-out hover:brightness-80 space-x-1">
              <h1 className="text-white text-md font-display">Рецепти</h1>
            </div>
            <div onClick={() => { navigate('/favorites') }} className="flex items-center cursor-pointer transition-all hover:scale-110 ease-in-out hover:brightness-80 space-x-1">
              <h1 className="text-white text-md font-display">Запазени</h1>
              <img className="h-9 invert" src="/images/bookmark.png" />
            </div>
            <div onClick={() => { isSignedIn ? navigate('/profilepage') : navigate('/login') }}
              className="flex items-center cursor-pointer transition-all hover:scale-110 ease-in-out hover:brightness-80 space-x-2">
              <h1 className="text-white text-md font-display">Профил</h1>
              <img className="h-13 invert" src="/images/user.png" />
            </div>
          </div>
        </div>
      }
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/recipes" element={<RecepiesPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
      </Routes>
    </>
  )
}

export default App
