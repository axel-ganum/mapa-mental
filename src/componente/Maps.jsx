import React from 'react'
import foto from '../assets/mapa.jpg'

const Maps = () => {
  const mapas = [
    {
      id: 1,
      nombre: 'Mi Nuevo Mapa Mental',
      miembros: 'Solo tú',
      modificado: '1 de jun. de 2024',
      imagen: foto// URL de la miniatura
    },
    {
      id: 2,
      nombre: 'Mi Nuevo Mapa Mental',
      miembros: 'Solo tú',
      modificado: '2 de jun. de 2024',
      imagen: foto// URL de la miniatura
    },
    {
      id: 3,
      nombre: 'Mi Nuevo Mapa Mental',
      miembros: 'Solo tú',
      modificado: '4 de jun. de 2024',
      imagen: foto// URL de la miniatura
    },
  ];
  return (
    <div className='container mx-auto p-6'>
    <h2 className='text-2xl font-semibold mb-4'>Todos los Mapas</h2>
    {mapas.length > 0 ? (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {mapas.map((mapa) => (
        <div key={mapa.id} className='bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200'>
          <div className='p-4'>
            <h3 className='text-lg font-semibold mb-2'>{mapa.nombre}</h3>
            <img src={mapa.imagen} alt={mapa.nombre} className='w-full h-auto object-cover mb-4 rounded-lg' style={{ maxHeight: '150px' }} />
            <p className='text-gray-600'>Miembros: {mapa.miembros}</p>
            <p className='text-gray-600'>Modificado: {mapa.modificado}</p>
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
