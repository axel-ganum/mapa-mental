import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './componente/NavBar';
import Home from './componente/Home';
import Profile from './componente/Profile';
import Maps from './componente/Maps';
import MapaEditos from './componente/MapaEditos';
import { ReactFlowProvider } from 'react-flow-renderer'

const App = () => {
  return (
    <Router>
      
      <div>
      <NavBar/>
       <Routes>     
          <Route path='/' element={<Home/>} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/editor'  element={<MapaEditos/>} />
          <Route path='/maps'  element={<Maps/>} />
        </Routes>
      </div>
    

    </Router>
  )
}

export default App

