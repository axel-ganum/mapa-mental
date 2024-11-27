import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useWebSocket } from './context/useWebSocket';

const Notifications = ({ isModalOpen, onClose }) => {
  const {notifications, unreadCount, markAsRead }  = useWebSocket();


  const handleNotificationClick = async (notification) => {
      markAsRead(notification)
  };

  if (!isModalOpen) return null;

  return (
    <div className="absolute right-0 mt-2 bg-white p-6 rounded shadow-lg z-50 w-96">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times"></i>
            </button>
        </div>
        <ul>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <li
                        key={notification._id}
                        className={`p-3 hover:bg-gray-100 cursor-pointer ${
                            notification.seen ? 'text-gray-500' : 'font-bold'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        {notification.message} {/* Mostrar el mensaje aquí */}
                    </li>
                ))
            ) : (
                <p>No hay notificaciones</p>
            )}
        </ul>
    </div>
);
};

export default Notifications;



