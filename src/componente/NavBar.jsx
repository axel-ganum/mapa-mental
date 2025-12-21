import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Notifications from "../componente/Notifications";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useWebSocket } from "./context/useWebSocket";

const NavBar = () => {
  const { unreadCount, resetUnreadCount } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const toggleMenu = () => {
    console.log("Menu toggled, current state:", isOpen);
    setIsOpen(!isOpen);
  };

  const toggleNotificationsModal = () => {
    console.log("Modal toggled, current state:", isModalOpen);
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      resetUnreadCount();
    }
  };


  return (
    <div className="bg-black fixed top-0 left-0 w-full z-50 p-4 ">
      <nav className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white/10 p-1.5 rounded-xl backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-white text-xl font-bold tracking-tight">MindMe</div>
        </Link>
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Perfil
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
              >
                Salir
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Notifications
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default NavBar;

