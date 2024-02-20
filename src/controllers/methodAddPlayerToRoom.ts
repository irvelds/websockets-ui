
import { IPlayer, IRoom } from '../types/types';
import { Rooms, mapPlayers } from '../state/state';
import { IWebSocket } from '../types/types';
import { updateRoomList } from './methodUpdateRoom';
import { createGame } from './methodCreateGame';



export const findFreeRoomId = () =>{
    const freeRooms:IRoom[] = Rooms.filter(room => room.roomUsers.length < 2);
    if (freeRooms.length > 0) {
        return freeRooms[0].roomId;
    }
    return null;
};


export const methodAddPlayerToRoom = (ws: IWebSocket, request: any): void => {
    console.log(ws.index);
    const userName = mapPlayers.get(ws);

    if (userName) {
        const freeRoomId = findFreeRoomId();
        if (freeRoomId) {
            const room = Rooms.find((room) => {
                return freeRoomId === room.roomId;
            });


            if (room) {
                // console.log(room);

                //console.log(Rooms);

                // const index = room.roomUsers.find(i => i.indexId)?.indexId;

                // const exist = Rooms.find(e => e.roomUsers.find(i => i.indexId === ws.index));
                // if (exist) {
                //     console.log('This user has already been added to the game, select another');
                //     return;
                // }

                if (room.roomUsers.find(user => user.indexId === ws.index)) {
                    console.log('This user has already been added to the game, select another');
                    return;
                }

                const response = addPlayerToRoom(freeRoomId, userName, ws);
                createGame(freeRoomId, ws);
                ws.send(JSON.stringify(response));
                updateRoomList(ws);
            }
        }

    }

};





export const addPlayerToRoom = (id: number, name: string, ws: IWebSocket) => {

    /*Выбираю комнату */
    const indexRoom = Rooms.findIndex((room) => room.roomId === id);

    const selectRoom: IRoom = Rooms[indexRoom];

    /*индекс до добавления*/
    const index = selectRoom.roomUsers.length;

    /*Кладу юзеров*/
    const newUser = {
        name: name,
        index,
        indexId: ws.index as string,
    };


    selectRoom.roomUsers.push(newUser);

    const response = {
        type: 'add_user_to_room',
        data: JSON.stringify({
            indexRoom,
        }),
        id: 0,
    };
    return response;
};
