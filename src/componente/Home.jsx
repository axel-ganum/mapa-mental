import React from 'react'
import {Link} from 'react-router-dom'
import backround from '../assets/backround.jpg'
const Home = () => {
  return (
    <div className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${backround})`}}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative text-center text-white p-6">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in-down">Bienvenido al Editor de Mapas Mentales</h1>
        <p className="text-lg mb-8 animate-fade-in-up">Crear, organiza y visualiza tus ideas de manera efectiva con nuestro editor de mapas mentales</p>
        <div className="flex justify-center space-x-4">
          <Link to="/editor" className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded transition-transform transform hover:scale-105">
            Crear Nuevo Mapa
          </Link>
          <Link to="/maps" className="px-6 py-2 text-white bg-green-500 hover:bg-green-700 rounded transition-transform transform hover:scale-105">
            Ver Mapas Existentes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home
