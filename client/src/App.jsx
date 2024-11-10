import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Components/Home/Home.jsx'
import Admin from './Components/AdminHead/Admin.jsx'
import SystemAdmin from './Components/SystemAdmin/SystemAdmin.jsx'
import Login from './Components/Login/Login.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/private/login" element={<Login/>}/>
          <Route path="/private/admin" element={<Admin/>}/>
          <Route path="/private/systemadmin" element={<SystemAdmin/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
