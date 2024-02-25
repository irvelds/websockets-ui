
import { IRoom } from '../types/types';
import { Rooms, Players } from '../state/state';
import { IWebSocket } from '../types/types';
import { updateRoomList } from './methodUpdateRoom';
import { createGame } from './methodCreateGame';
import { clients } from '../websocket';



export const methodAddPlayerToRoom = (ws: IWebSocket): void => {

    const userName = Players.find((player) => {
        return player.index === ws.index;
    })?.name;

    if (userName) {

        const freeRoomId = Rooms.find((room) => room.roomUsers.length < 2);

        if (freeRoomId) {

            const notAddPlayerRoom = Rooms.find((room) => room.roomId === freeRoomId.roomId);
            if (notAddPlayerRoom!.roomUsers.find(user => user.indexId === ws.index)) {
                console.log('This user has already been added to the game, select another');
                return;
            }

            const response = addPlayerToRoom(freeRoomId.roomId, userName, ws);

            createGame(freeRoomId.roomId, ws);


            clients.forEach((ws) => {
                ws.send(JSON.stringify(response));
            });

            updateRoomList(ws);
        }

    }

};


export const addPlayerToRoom = (id: number, userName: string, ws: IWebSocket) => {



    /*Выбираю комнату */
    const indexRoom = Rooms.findIndex((room) => room.roomId === id);

    const selectRoom: IRoom = Rooms[indexRoom];

    /*индекс до добавления*/
    const index = selectRoom.roomUsers.length;

    /*Кладу юзеров*/
    const newUser = {
        name: userName,
        index,
        indexId: ws.index as string,
    };


    selectRoom.roomUsers.push(newUser);


    if (selectRoom.roomUsers.length >= 2) {
        console.log('There are already two players in the room');
        return;
    }

    // const existGameInstance: gameParams = gameInstances.find(game => game.roomId === id) as gameParams;

    // if (existGameInstance.wssockets.length >= 2) {
    //     console.log('There are already two players in the room');
    //     return;
    // }


    const response = {
        type: 'add_user_to_room',
        data: JSON.stringify({
            indexRoom,
        }),
        id: 0,
    };
    return response;

};
