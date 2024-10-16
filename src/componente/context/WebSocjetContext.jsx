import React, { createContext, useState, useEffect } from 'react'; 

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({children }) => {
    const [ws, setWs] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        let webSocket;

        const setUpWebSocket = () => {
            const token = localStorage.getItem('token');
            if (token) {
                console.log('Conectando WebSocket con el token:', token);

                webSocket = new WebSocket(`ws://localhost:3000/ws?token=${token}`);
                
                webSocket.onopen = () => {
                    console.log('Conexión WebSocket establecida');
                    setWs(webSocket); // Guardar el WebSocket en el estado
                };

                webSocket.onerror = (error) => {
                    console.error('Error en el WebSocket:', error);
                };

                webSocket.onclose = () => {
                    console.log('Conexión WebSocket cerrada, reintentando en 5 segundos...');
                    setTimeout(setUpWebSocket, 5000)
                };
                webSocket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.action === 'notification') {
                        console.log('Notificación recibida:', data.message);
                        const newNotification = {
                            _id: data._id, // ID único para cada notificación
                            message: data.message,
                            seen: false // Estado inicial de no leída
                        };
                        setNotifications((prevNotifications) => {
                            if (prevNotifications.find(n => n._id === newNotification._id)) {
                                 return prevNotifications
                                
                            }
                        
                          return [newNotification, ...prevNotifications];
                    });   
                        setUnreadCount((prevCount) => prevCount + 1)
                    }
                };
            } else {
                console.error('No se pudo establecer la conexión porque no hay un token disponible');
            }
        };

        setUpWebSocket();

        return () => {
            if (webSocket) {
                console.log('Cerrando WebSocket al desmontar componente');
                webSocket.close(); // Cerrar el WebSocket al desmontar el componente
            }
        };
    }, []); 

        const markAsRead = (notification) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n._id === notification._id ? { ...n, seen: true } : n
      )
    );
    setUnreadCount((prevCount) => prevCount - 1);

    // Enviar mensaje al servidor para marcar como leída
    if (ws) {
        try {
      ws.send(JSON.stringify({ action: 'mark_as_read', notificationId: notification._id }));
        } catch (error) {
            console.error('Error al enviar el mensaje por webSocket:', error)
        }
    }else {
        console.error('WebSocket no esta conectado')
    }
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };
    return (
        <WebSocketContext.Provider value={{ws, notifications, unreadCount, markAsRead, resetUnreadCount}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketContext;

