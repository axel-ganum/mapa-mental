import {useRef} from 'react';

const userShareMap = (ws, mapId) => {
    const shareMapWithEmail = (email) => {
        if(ws.current && ws.current.readyState === WebSocket.OPEN) {
            const payload = {
                action:'shareMap',
                payload: {mapId, userEmail: email},
            };
            ws.current.send(JSON.stringify(payload));
             console.log(`Solicitando compartir el mapaID: ${mapId} con ${email}`)
            
        } else {
            console.error('Websocket no está conectado')
        }
    };

     return {shareMapWithEmail};
};

export default userShareMap