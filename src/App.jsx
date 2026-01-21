import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import WelcomePage from "./Pages/WelcomePage"
import RecepiesPage from "./Pages/RecipesPage"
import LogIn from "./Pages/LogIn"
import SignUp from "./Pages/SignUp"
import ProfilePage from "./Pages/ProfilePage"
import FavoritesPage from "./Pages/FavoritesPage.jsx"
import { useEffect, useState } from "react"
import isAuth from './Backend/isAuth.js'

function App() {
  const navigate = useNavigate()
  const address = useLocation()
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    async function func() {
      setIsSignedIn(await isAuth())
    }
    func()
  }, [address])

  return (
    <>
      <div className="w-screen h-28 bg-lime-900 z-10 flex items-center p-3 fixed top-0 shadow-2xl">
        <img onClick={() => { navigate('/') }} className="h-22 cursor-pointer" src="/images/nutri-bg-logo.png" />
        <div className="w-full flex justify-end items-center space-x-8">
          <div onClick={()=>{navigate('/recipes')}} className="flex items-center cursor-pointer transition-all hover:scale-110 ease-in-out hover:brightness-80 space-x-1">
            <h1 className="text-white text-md font-display">Рецепти</h1>
          </div>
          <div onClick={()=>{navigate('/favorites')}} className="flex items-center cursor-pointer transition-all hover:scale-110 ease-in-out hover:brightness-80 space-x-1">
            <h1 className="text-white text-md font-display">Запазени</h1>
            <img className="h-9 invert" src="/images/bookmark.png" />
          </div>
          <div onClick={() => { isSignedIn ? navigate('/profilepage') : navigate('/login') }}
            className="flex items-center cursor-pointer transition-all hover:scale-110 ease-in-out hover:brightness-80 space-x-2">
            <h1 className="text-white text-md font-display">Профил</h1>
            <img className="h-15 invert" src="/images/user.png" />
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/recipes" element={<RecepiesPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage/>}/>
      </Routes>
    </>
  )
}

export default App
