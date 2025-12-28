import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Maps = () => {
  const [mapas, setMapas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMapas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://api-mapa-mental.onrender.com/maps/all', {
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
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este mapa mental?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-mapa-mental.onrender.com/maps/${mapa_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el mapa mental');
      }

      setMapas((prevMapas) => prevMapas.filter((mapa) => mapa._id !== mapa_id));
      toast.success('Mapa eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar el mapa mental');
      toast.error('Error al eliminar el mapa mental')
    }
  }

  console.log("userId:", userId);
  console.log(mapas)

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6">
      <ToastContainer position="bottom-right" theme="light" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mis Mapas Mentales</h2>
            <p className="text-slate-500 mt-1 font-medium">Gestiona y organiza tus ideas visuales</p>
          </div>

          <Link
            to="/editor"
            className="premium-button premium-button-blue shadow-blue-500/20"
          >
            <i className="fas fa-plus mr-2 text-xs"></i>
            Nuevo Mapa
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Cargando tus mapas...</p>
          </div>
        ) : mapas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mapas.map((mapa) => {
              const isOwner = mapa.isOwner;
              return (
                <div
                  key={mapa._id}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] transition-all duration-500 flex flex-col transform hover:-translate-y-1"
                >
                  {/* Thumbnail Area */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 group-hover:cursor-pointer" onClick={() => handleViewMore(mapa._id)}>
                    {mapa.thumbnail ? (
                      <img
                        src={
                          mapa.thumbnail.startsWith("data:image")
                            ? mapa.thumbnail
                            : `data:image/png;base64,${mapa.thumbnail}`
                        }
                        alt={mapa.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                        <i className="fas fa-image text-4xl mb-2 opacity-20"></i>
                        <span className="text-xs font-medium uppercase tracking-wider opacity-60">Sin vista previa</span>
                      </div>
                    )}

                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {isOwner ? (
                        <span className="bg-blue-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          Tuyo
                        </span>
                      ) : (
                        <span className="bg-emerald-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          Compartido
                        </span>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                        <i className="fas fa-external-link-alt"></i>
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {mapa.title}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
                        {mapa.description || 'Sin descripción disponible.'}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 mt-auto pt-4 border-t border-slate-50">
                      <div className="flex items-center text-[12px] text-slate-400 font-medium">
                        <i className="far fa-user w-5 text-blue-400"></i>
                        <span className="text-slate-600 truncate">Por {mapa.user.username}</span>
                      </div>
                      <div className="flex items-center text-[12px] text-slate-400 font-medium">
                        <i className="far fa-calendar-alt w-5 text-blue-400"></i>
                        <span>Actualizado {new Date(mapa.updatedAt).toLocaleDateString()}</span>
                      </div>

                      {!isOwner && mapa.sharedWith && (
                        <div className="flex items-center text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg mt-2 font-semibold">
                          <i className="fas fa-handshake mr-2 opacity-60"></i>
                          Colaborando
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleViewMore(mapa._id)}
                      className="flex-grow py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-slate-200"
                    >
                      Abrir Editor
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => handleDeleteMap(mapa._id)}
                        className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300 border border-slate-100 hover:border-rose-100"
                        title="Eliminar mapa"
                      >
                        <i className="far fa-trash-alt"></i>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-12 text-center border border-dashed border-slate-200 shadow-sm max-w-2xl mx-auto mt-10">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-project-diagram text-3xl text-blue-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Tu lienzo está vacío</h3>
            <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
              Aún no tienes mapas mentales guardados. Empieza a visualizar tus ideas hoy mismo.
            </p>
            <Link
              to="/editor"
              className="px-10 py-4 text-white bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 inline-flex items-center gap-3"
            >
              <span>Crear mi primer mapa</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maps;
