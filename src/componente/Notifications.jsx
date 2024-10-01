import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Notifications = ({isOpen, onClose}) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = fetch('http://localhost:3000/notifications', {
                method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },  
            });
           
            if(!response.ok) {
            throw new Error('Error al obtener las notificaiones')
            }

            const data = await response.json()
            setNotifications(data);

        } catch (error) {
            toast.error('Error al cargar notificaciones')
        } finally {
            setLoading(false)
        }
      }
     if(isOpen){
      fetchNotifications();
     }
    },[isOpen])

     const hanldeNotificationClick = async (notificationId) => {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:3000/notifications/${notificationId}`, {
          method: 'PUT',
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
          }
        });

        setNotifications(prevNotifications => prevNotifications.filter(n => n._id !== notificationId ))
      } catch (error) {
         console.error('Error al marcar como leido', error)
      }
     };

     if(!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-96'>
        <h2 className='text-xl font-semibold mb-4'>Notificaciones</h2>
        <ul>
           {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                 key={notification._id}
                 className='p-3 hover:bg-gray-100 cursor-pointer'
                 onClick={() => hanldeNotificationClick(notification._id)}
                >
                  {notification.message}
                </li>
              ))
            ) : (
              <p>No hay notificaciones</p>
           )}
        </ul>
        <button onClick={onClose} className='mt-4 bg-blue-500 text-white px-4 py-4 rounded'>
          Cerrar
        </button>
      </div>
      
    </div>
  )
}

export default Notifications


