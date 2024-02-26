
import { Players, Rooms } from '../state/state';
import { IWebSocket } from '../types/types';
import { addPlayerToRoom } from './methodAddPlayerToRoom';
import { updateRoomList } from './methodUpdateRoom';
import { createGame } from './methodCreateGame';

export const methodCreateRoom = (ws: IWebSocket) => {

  const userName = Players.find((player) => {
    return player.index === ws.index;
  });


  if (userName?.name) {
    const roomId = Rooms.length + 1;

    /*Создаю комнату*/
    const newRoom = {
      createBy: userName.index,
      roomId: roomId,
      roomUsers: [],
    };




    const existRoomByUser = Rooms.find(room => room.roomUsers.find(user => user.indexId === newRoom.createBy));

    if (existRoomByUser && existRoomByUser.roomUsers.length !== 2) {
      console.log('The user has already created a room');
      return;
    }


    Rooms.push(newRoom);
    const response = addPlayerToRoom(roomId, userName.name, ws);
    createGame(roomId, ws);
    ws.send(JSON.stringify(response));
    updateRoomList(ws);

  }
};
