import React, { useEffect, useState } from 'react' 
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Maps = () => {
const [mapas, setMapas] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
  const fetchMapas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/maps/all',{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

       if (!response.ok) {
        throw new Error('Error al obtener los mapas mentales')
       }


      const data = await response.json();

      setMapas(data)
    } catch (error) {
      console.error('Error al obtener los mpas mentales:', error)
    } finally {
      setLoading(false);
    }
  };

  fetchMapas();
}, []);

const handleViewMore = (mapa_id) => {
  navigate(`/editor?id=${mapa_id}`)
}

 const handleDeleteMap = async (mapa_id) => {
  const confirmDelte = window.confirm('¿Etás deguro que desea eliminar este mapa mental');
  if(!confirmDelte) return;

  try {
     const token = localStorage.getItem('token');
     const response = await fetch(`http://localhost:3000/maps/${mapa_id}`, {
      method:'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
     });

     if(!response.ok) {
      throw new Error('Error al eliminar el mapa mental');
     }

     setMapas((prevMapas) => prevMapas.filter((mapa) => mapa._id !== mapa_id));
     toast.success('Mapa eliminado exitosamente')
  } catch (error) {
    console.error('Error al eliminar el mapa mental');
    toast.error('Error al eliminar el mapa mental')
  }
 }
  return (
    <div className="container mx-auto p-6">
      <ToastContainer/>
  <h2 className="text-2xl font-semibold mb-4">Todos los Mapas</h2>
  {loading ? (
    <p>cargando mapas...</p>
  ) : mapas.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mapas.map((mapa) => {
        // Establece una altura fija para la imagen
        const imageHeight = 200; // Ajusta la altura fija que desees
        const aspectRatio = 16 / 9;
        return (
          <div
            key={mapa._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex flex-col"
          >
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="text-lg font-semibold mb-2">{mapa.title}</h3>

              {mapa.sharedWith && mapa.sharedWith.includes(userId) && (
                <div className='text-sm text-gray-500 italic mb-2'>
                  Compartido contigo
                  <div className='mt-1'>
                  <p className='font-semibold'>Compartir con:</p>
                  <ul className='list-disc list-inside'>
                    {mapa.sharedWith.map((user) => (
                      <li key={user._id} className='text-gray-700'>
                        {user.username}
                      </li>
                    ))}
                  </ul>
              </div>
              </div>
                
              )}
              <div
                className="relative w-full"
                style={{ height: `${imageHeight}px`, paddingBottom: `${100 / aspectRatio}%`, overflow: 'hidden' }}
              >
                {mapa.thumbnail ? (
                  <img
                    src={
                      mapa.thumbnail.startsWith("data:image")
                        ? mapa.thumbnail
                        : `data:image/png;base64,${mapa.thumbnail}`
                    }
                    alt={mapa.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: "contrast(0.8)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                ) : (
                  <p className="text-gray-500">No hay imagen disponible</p>
                )}
              </div>
              <div className="mt-4 flex-grow">
                <p className="text-gray-600">Miembro: {mapa.user.username}</p>
                <p className="text-gray-600">Descripcion: {mapa.description}</p>
                <p className="text-gray-600">
                  Creado: {new Date(mapa.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className='p-4 flex justify-end'>
               <button 
               onClick={() => handleViewMore(mapa._id)}
               className='bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition-transform hover:scale-105 mr-4'>
                Ver más
               </button>
               <button 
                onClick={() => handleDeleteMap(mapa._id)}
                className='bg-red-500 text-white px-4 rounded hover:bg-red-600 transition-transform hover:scale-105'
               >
                Eliminar
               </button>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center p-6">
      <p className="text-gray-600 text-lg mb-4">
        No tienes mapas mentales creados aún.
      </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Crear nuevo mapa mental
      </button>
    </div>
  )}
</div>


);
}

export default Maps
