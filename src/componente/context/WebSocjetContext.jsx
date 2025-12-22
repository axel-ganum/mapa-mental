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
            let token = localStorage.getItem('token');

            // Clean up invalid token strings
            if (token === 'undefined' || token === 'null' || !token) {
                console.error('WebSocket Context: No hay un token válido disponible');
                return;
            }

            // Basic JWT check and expiration logic
            try {
                const parts = token.split('.');
                if (parts.length !== 3) throw new Error('Token malformado');

                const payload = JSON.parse(atob(parts[1]));
                if (payload.exp && Date.now() >= payload.exp * 1000) {
                    console.error('WebSocket Context: El token ha expirado. Por favor, inicia sesión de nuevo.');
                    // Don't try to connect with an expired token
                    return;
                }
            } catch (e) {
                console.error('WebSocket Context: Error validando el token:', e.message);
                // If it's malformed, we shouldn't keep trying
                return;
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
                console.error('Error en el WebSocket Global: El servidor rechazó la conexión.');
            };

            webSocket.onclose = (event) => {
                setWs(null);
                console.log(`Conexión WebSocket Global cerrada (Código: ${event.code}).`);

                // Only retry if it wasn't a clean close and we still have a token
                const currentToken = localStorage.getItem('token');
                if (currentToken && currentToken !== 'undefined' && event.code !== 1000) {
                    console.log('Programando reintento en 5 segundos...');
                    if (!reconnectTimeout) {
                        reconnectTimeout = setTimeout(() => {
                            reconnectTimeout = null;
                            setUpWebSocket();
                        }, 5000);
                    }
                }
            };

            webSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setLastMessage(data);

                    if (data.action === 'notification') {
                        const newNotification = {
                            _id: data._id,
                            seen: false,
                            message: data.message
                        };
                        setNotifications((prevNotifications) => {
                            if (prevNotifications.find(n => n._id === newNotification._id)) {
                                return prevNotifications;
                            }
                            return [newNotification, ...prevNotifications];
                        });
                        setUnreadCount((prevCount) => prevCount + 1);
                    }
                } catch (err) {
                    console.error('Error procesando mensaje WebSocket:', err);
                }
            };
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

