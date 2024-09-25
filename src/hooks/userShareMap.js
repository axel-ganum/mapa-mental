
const userShareMap = (ws, mapId) => {
    const shareMapWithEmail = (emailToShare) => {
        if(!ws) {
            console.log("WebSocket no est definido");
            return
        };

        if(!mapId) {
            console.error("mapId no está definido.");
            return
        }

        if(!emailToShare) {
            console.error("No se proporcionó un correo electrónico para compartir el mapa.");
            return
        }

        const payload = {
            action: 'shareMap',
            payload: {
              mapId,
              emailToShare,
            },
        };
        ws.send(JSON.stringify(payload));
        console.log(`Mapa con ID ${mapId} compartido con ${emailToShare}`)
    }
     return {shareMapWithEmail};
};

export default userShareMap