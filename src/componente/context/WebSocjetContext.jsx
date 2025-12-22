import React, { createContext, useState, useEffect } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [ws, setWs] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        let webSocket;
        let reconnectTimeout;

        const setUpWebSocket = () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Basic JWT check
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.exp && Date.now() >= payload.exp * 1000) {
                        console.error('WebSocket Context: Token expirado detectado');
                        // Optional: trigger logout or warning
                    }
                } catch (e) {
                    console.error('WebSocket Context: Error decodificando token');
                }

                console.log('Conectando WebSocket Global...');

                webSocket = new WebSocket(`wss://api-mapa-mental.onrender.com?token=${token}`);

                webSocket.onopen = () => {
                    console.log('Conexión WebSocket Global establecida');
                    setWs(webSocket);
                    if (reconnectTimeout) {
                        clearTimeout(reconnectTimeout);
                        reconnectTimeout = null;
                    }
                };

                webSocket.onerror = (error) => {
                    console.error('Error en el WebSocket Global:', error);
                };

                webSocket.onclose = () => {
                    console.log('Conexión WebSocket Global cerrada, reintentando en 5 segundos...');
                    if (!reconnectTimeout) {
                        reconnectTimeout = setTimeout(() => {
                            reconnectTimeout = null;
                            setUpWebSocket();
                        }, 5000);
                    }
                };
                webSocket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    setLastMessage(data);

                    if (data.action === 'notification') {
                        console.log('Notificación recibida:', data.message);
                        const newNotification = {
                            _id: data._id,
                            seen: false,
                            message: data.message
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
                console.log('Cerrando WebSocket Global al desmontar');
                webSocket.close();
            }
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
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


        if (ws) {
            try {
                ws.send(JSON.stringify({ action: 'mark_as_read', notificationId: notification._id }));
            } catch (error) {
                console.error('Error al enviar el mensaje por webSocket:', error)
            }
        } else {
            console.error('WebSocket no esta conectado')
        }
    };

    const resetUnreadCount = () => {
        setUnreadCount(0);
    };
    return (
        <WebSocketContext.Provider value={{ ws, notifications, unreadCount, lastMessage, markAsRead, resetUnreadCount }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketContext;

