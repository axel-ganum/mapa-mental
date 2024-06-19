import React, { useState } from 'react';
import imagenperfil from  '../assets/imagenl.jpg';


const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Ramdom',
    email: 'ramdom@exampel.com',
    theme: 'Claro',
    lenguage: 'Español',
    profilePic: imagenperfil,
    stats: {
      totalMapas: 10,
      sharesMpas: 5,
      activeCollaboarations: 2,
      lastActivity: '15 de jun. de 2024'
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Perfil actualizado:', user);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Perfil</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold mb-4">Editar Perfil</h4>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre:</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Correo Electrónico:</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Tema:</label>
              <select
                name="theme"
                value={user.theme}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="Claro">Claro</option>
                <option value="Oscuro">Oscuro</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Idioma:</label>
              <select
                name="lenguage"
                value={user.lenguage}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="Español">Español</option>
                <option value="Inglés">Inglés</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-center mb-4">
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Preferencias</h4>
              <p className="text-gray-600">Tema: {user.theme}</p>
              <p className="text-gray-600">Idioma: {user.lenguage}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Estadísticas</h4>
              <p className="text-gray-600">Total de Mapas: {user.stats.totalMapas}</p>
              <p className="text-gray-600">Mapas Compartidos: {user.stats.sharesMpas}</p>
              <p className="text-gray-600">Colaboraciones Activas: {user.stats.activeCollaboarations}</p>
              <p className="text-gray-600">Última Actividad: {user.stats.lastActivity}</p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Editar Perfil
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;