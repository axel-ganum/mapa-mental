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
      const response = await fetch('http://localhost:3000/perfil', {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/perfil', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
         body: JSON.stringify({
          theme: user.theme,
          profilePicture: user.profilePicture,
         }),
      });

      if (!response.ok) {
         throw new Error('Error al actualilzar el perfil')
      }

      const data = await response.json();
      console.log(data.message);
      setUser(data.user)
      setIsEditing(false)
    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
    }
  }

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
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Perfil</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Editar Perfil</h4>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Nombre:</label>
              <input
                type="text"
                name="name"
                value={user.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Correo Electrónico:</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Foto de Perfil:</label>
              <div className="relative group">
                <img
                  src={user.profilePicture || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-2 cursor-pointer"
                  onClick={() => setShowFullImage(true)}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('fileInputForm').click()}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full shadow-md transition hover:bg-blue-600"
                >
                  ✎
                </button>
                <input
                  type="file"
                  accept="image/*"
                  id="fileInputForm"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
              {isSaved? "Guardando!" : "Guardar Cambios"}
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
            <div className="flex items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-700">{user.username}</h3>
              <div className="relative group">
                <img
                  src={user.profilePicture || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mr-4 cursor-pointer shadow-md"
                  onClick={() => setShowFullImage(true)}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-700">{user.name}</h3>
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
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Editar Perfil
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
  
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-auto h-auto max-w-full max-h-full"
            onClick={() => setShowFullImage(false)}
          />
        </div>
      )}
    </div>
  );
}  
export default Profile;



