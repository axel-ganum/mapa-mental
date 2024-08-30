import React, { useEffect, useState } from 'react' 


const Maps = () => {
const [mapas, setMapas] = useState([]);
const [loading, setLoading] = useState(true);

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


  return (
    <div className='container mx-auto p-6'>
    <h2 className='text-2xl font-semibold mb-4'>Todos los Mapas</h2>
    { loading ? (
      <p>cargando mapas...</p>
    ):
   mapas.length > 0 ? (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {mapas.map((mapa) => (
        <div key={mapa._id} className='bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200'>
          <div className='p-4'>
            <h3 className='text-lg font-semibold mb-2'>{mapa.title}</h3>
           {mapa.thumbnail ? (
            <img src={mapa.thumbnail.startsWith('data:image') ? mapa.thumbnail : `data:image/png;base64,${mapa.thumbnail}`}
            alt={mapa.title} 
            className='w-full h-auto object-cover mb-4 rounded-lg shadow-lg'
            style={{ maxHeight: '150px', filter: 'brightness(1.2) contrast(1.1)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
             />
           ) : ( 
             <p className='text-gray-500'>No hay imagen disponible</p>
           )}
            <p className='text-gray-600'>Miembro: {mapa.user.username}</p>
            <p className='text-gray-600'>Descripcion: {mapa.description}</p>
            <p className='text-gray-600'>Creado:{new Date(mapa.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center p-6">
          <p className="text-gray-600 text-lg mb-4">No tienes mapas mentales creados aún.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Crear nuevo mapa mental
          </button>
        </div>
      )}
  </div>

);
}

export default Maps
