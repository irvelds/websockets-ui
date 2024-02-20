
import { mapPlayers, Rooms } from '../state/state';
import { IRoom, IWebSocket } from '../types/types';
import { addPlayerToRoom } from './methodAddPlayerToRoom';
import { updateRoomList } from './methodUpdateRoom';
import { createGame } from './methodCreateGame';

export const methodCreateRoom = (ws: IWebSocket) => {
  const userName = mapPlayers.get(ws);
  if (userName) {

    const roomId = Rooms.length + 1;
    /*Создаю комнату*/
    const newRoom = {
      roomId: roomId,
      roomUsers: [],
    };

    Rooms.push(newRoom);

    const response = addPlayerToRoom(roomId, userName, ws);

    createGame(roomId, ws);

    ws.send(JSON.stringify(response));
    updateRoomList(ws);
  }
};
