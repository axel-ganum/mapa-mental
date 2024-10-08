import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Notifications from '../componente/Notifications.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';


const NavBar = () => {
  const [isOpen, setIopen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = () => {
    setIopen(!isOpen);
  };

  const toggleNotificationsModal = () => {
    setIsModalOpen(!isModalOpen);
  }

   
     const fetchUnreadNotifications = async () => {
      try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/unread', {
        method : 'GET',
        headers : {
          'Authorization': `Bearer ${token}`,
        },
      });
     if(!response.ok) {
      throw new Error('Error al obtener el numero de notificaciones no leidas')
     }
      const data = await response.json();
      setUnreadCount(data.count)
      
  }catch (error) {
    console.error('Error fetching unread notifications:', error)
  }
};
     

  useEffect(() => {
    
    fetchUnreadNotifications();
   
  },[])



  return (
    <div className="bg-black p-4">
      <nav className="container mx-auto flex items-center justify-between">
        <div className=" text-white  text-lg font-bold">Mi Mapa Mental</div>
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:text-white"
          >
            <svg
              className="w-g h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/sv"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>
        <div className={`lg:flex ${isOpen ? "block" : "hidden"} mt-4 lg:mt-0`}>
          <ul className="flex space-x-7 text-white">
            <li>
              <Link
                to="/"
                className="hover:text-gray-300"
                onClick={() => setIopen(false)}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="hover:text-gray-300"
                onClick={() => setIopen(false)}
              >
                Perfil
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-gray-300"
                onClick={() => setIopen(false)}
              >
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="hover:text-gray-300"
                onClick={() => setIopen(false)}
              >
                Registrarse
              </Link>
            </li>
            <li>
               <button onClick={toggleNotificationsModal} className="relative">
                 <i className="fas fa-bell text-white"></i> 
                  {unreadCount > 0 && (
                   <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                      {unreadCount}
                   </span>
                    )}
               </button>
            </li>
            <li>
              <Link
                to="/logout"
                className="hover:text-gray-300"
                onClick={() => setIopen(false)}
              >
                Salir
              </Link>
            </li>
          </ul>
        </div>
      </nav>

       <Notifications
        isModalOpen ={isModalOpen} 
        onClose = {() => setIsModalOpen(false)}
       />
    </div>
 );
};

export default NavBar;
