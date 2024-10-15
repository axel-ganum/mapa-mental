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
                    console.log('Conexión WebSocket cerrada');
                };
                webSocket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.action === 'notification') {
                        console.log('Notificación recibida:', data.message);
                        const newNotification = {
                            id: Date.now(), // ID único para cada notificación
                            message: data.message,
                            read: false // Estado inicial de no leída
                        };
                        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
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

        const markAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n._id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount((prevCount) => prevCount - 1);

    // Enviar mensaje al servidor para marcar como leída
    if (ws) {
      ws.send(JSON.stringify({ action: 'mark_as_read', notificationId }));
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

