import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import '@fortawesome/fontawesome-free/css/all.min.css';



const Notifications = ({isModalOpen, onClose}) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ws, setWs] = useState(null);

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/notifications', {
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
     if(isModalOpen){
      fetchNotifications();
       }

    },[isModalOpen])

    const setUpWebSocekt = () => {
      const token = localStorage.getItem('token');
      console.log('Conectando WebSocket con token:', token)
      
      const webSocket = new WebSocket(`ws://localhost:3000/ws?token=${token}`);

      webSocket.onopen= () => {
        console.log('Conexion WebSocket establecido');
        
      }

      webSocket.onmessage = (event) => {
        console.log('Mensaje recibido:', event.data);
        
        const message = JSON.parse(event.data);
        if (message.type === 'new_notification') {
          setNotifications((preventNotificacions) => [message.notification, ...preventNotificacions]);

        }else if (message.type === 'mark_as_read') {

          setNotifications((prevNotifications) => 
             prevNotifications.map((n) => 
                 n._id === message.notificationId ? {...n, read: true} : n
            )
          );

        }
      };
      
      webSocket.onerror = (error) =>{
        console.error('Error en el WebSocket:', error)
      };

      webSocket.onclose = () =>{
        console.log('Conexion WebSocket cerrada');
        
      }
       setWs(webSocket);

    }

useEffect(() => {
  setUpWebSocekt();

  return () => {
    if(ws) {
      ws.close();
    }
  }
}, []);

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

        if (ws) {
           ws.send(JSON.stringify({type:'mark_as_read', notificationId}))
        }

        setNotifications((prevNotifications) => prevNotifications.filter((n) => n._id !== notificationId ))
      } catch (error) {
         console.error('Error al marcar como leido', error)
      }
     };

     if(!isModalOpen) return null

  return (
      <div className='absolute right-0 mt-2  bg-white p-6 rounded shadow-lg z-50 w-96 '>
        <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold mb-4'>Notificaciones</h2>
        <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
          <i className='fas fa-times'></i>
        </button>
        </div>
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
        
      </div>
      
   
  )
}

export default Notifications


