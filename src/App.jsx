import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './componente/NavBar';
import Home from './componente/Home';
import Profile from './componente/Profile';
import Maps from './componente/Maps';
import MapaEditor from './componente/MapaEditor';
import { ReactFlowProvider } from 'react-flow-renderer'
import LoginForm from './componente/LoginForm';
import RegisterForm from './componente/RegisterForm';
import ProtectedRoute from './componente/ProtectedRoute';
import Logout from './componente/Logout';
const App = () => {
  return (
    <Router>
      
      <div>
      <NavBar/>
       <Routes>     
       <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/editor" element={<ProtectedRoute element={<MapaEditor />} />} />
        <Route path="/maps" element={<ProtectedRoute element={<Maps />} />} />
      <Route path='/logout' element={<Logout/>} />
        </Routes>
      </div>
    

    </Router>
  )
}

export default App

