import { Rooms } from '../state/state';
import { IWebSocket } from '../types/types';
import { clients } from '../websocket';



export const updateRoomList = (ws: IWebSocket) => {
    const response = {
        type: 'update_room',
        data: JSON.stringify(Rooms),
        id: 0,
    };
    clients.forEach((ws) => {
        ws.send(JSON.stringify(response));
    });
};

