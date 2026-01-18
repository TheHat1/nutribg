import { Route, Routes, useNavigate } from "react-router-dom"
import WelcomePage from "./Pages/WelcomePage"
import RecepiesPage from "./Pages/RecipesPage"

function App() {
  const navigate = useNavigate()

  return (
    <>
      <div className="w-screen h-37 bg-lime-900 z-10 flex items-center p-3 fixed top-0"> 
        <img onClick={()=>{navigate('/')}} className="h-35 cursor-pointer" src="/images/nutri-bg-logo.png"/>
      </div>
      <Routes>
        <Route path="/" element={<WelcomePage/>}/>
        <Route path="/recipes" element={<RecepiesPage/>}/>
      </Routes>
    </>
  )
}

export default App
