import React, { useState, useEffect} from 'react';


const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [user, setUser] = useState({});
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
   const fecthUserProfile = async () => {
     try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://api-mapa-mental.onrender.com/perfil', {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`,  
        'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el perfil del usuario')
        
      }

      const data = await response.json();
      setUser(data)
      
    } catch (error) {
       console.error('Error al obtener el perfil del usuario:', error)
      
    }
   }
 {
    fecthUserProfile()
}

  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };





  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Perfil actualizado:', user);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    updateUserProfile();
  };

   const handleLogout = () => {

    localStorage.removeItem('token');

    window.location.href = "/login"
   }
   return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-3xl p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Perfil</h2>
  
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Editar Perfil</h4>
            <div>
              <label className="block text-gray-600 mb-1">Nombre:</label>
              <input
                type="text"
                name="name"
                value={user.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                {isSaved ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-center mb-6 space-x-4">
              <img
                src={`https://avatars.dicebear.com/api/avataaars/${user.username}.svg`}
                alt="Avatar"
                className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full shadow-md cursor-pointer object-cover"
              />
              <div>
                <h3 className="text-2xl font-semibold text-gray-700">{user.username}</h3>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 text-gray-700">Estadísticas</h4>
              <p className="text-gray-600">Total de Mapas: {user.stats?.totalMapas || 0}</p>
              <p className="text-gray-600">Mapas Compartidos: {user.stats?.sharesMpas || 0}</p>
              <p className="text-gray-600">Colaboraciones Activas: {user.stats?.activeCollaborations || 0}</p>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
  
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              &times;
            </button>
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-auto h-auto max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  </div>
  
  

  

);
}  
export default Profile;



