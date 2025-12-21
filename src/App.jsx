import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './componente/NavBar';
import Home from './componente/Home';
import Profile from './componente/Profile';
import Maps from './componente/Maps';
import MapaEditor from './componente/MapaEditor';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import LoginForm from './componente/LoginForm';
import RegisterForm from './componente/RegisterForm';
import ProtectedRoute from './componente/ProtectedRoute';
import Logout from './componente/Logout';
import CompartirMapa from './componente/CompartirMapa';
import { WebSocketProvider } from './componente/context/WebSocjetContext';
const App = () => {
  return (
    <Router>

      <div>
        <WebSocketProvider>
          <NavBar />
        </WebSocketProvider>
        <ReactFlowProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/editor" element={<ProtectedRoute element={<MapaEditor />} />} />
            <Route path="/maps" element={<ProtectedRoute element={<Maps />} />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/compartir/:mapId' element={<CompartirMapa />} />
          </Routes>
        </ReactFlowProvider>
      </div>


    </Router>
  )
}

export default App

