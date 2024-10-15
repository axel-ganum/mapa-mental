import React, {useContext} from 'react';
import WebSocketContext from './WebSocjetContext';


export const useWebSocket = () => {
    return useContext(WebSocketContext)
}