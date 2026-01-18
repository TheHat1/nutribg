import { Route, Routes } from "react-router-dom"
import WelcomePage from "./Pages/WelcomePage"

function App() {

  return (
    <>
      <div className="w-screen h-37 bg-lime-900 z-10 flex items-center p-3 fixed top-0"> 
        <img className="h-35" src="/images/nutri-bg-logo.png"/>
      </div>
      <Routes>
        <Route path="/" element={<WelcomePage/>}/>
      </Routes>
    </>
  )
}

export default App
