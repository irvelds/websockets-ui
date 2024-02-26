
import { IPlayer, IRequest, IResponse, IWebSocket } from '../types/types';
import { Players, Rooms, mapWsockets } from '../state/state';
import crypto from 'crypto';
import { updateRoomList } from './methodUpdateRoom';




export const methodRegistration = (ws: IWebSocket, request: IRequest) => {

    /*Добавляем индекс соединению*/
    ws.index = crypto.randomUUID().toString();
    mapWsockets.push(ws);

    const { name, password } = JSON.parse(request.data);

    // const existUser = Players.find((player) => player.name === name && player.password === password);
    // /*Если пользователь существует и соединение уже открыто*/
    // if (existUser) {

    //     const existWsocket = mapWsockets.find((socket) => socket.index === existUser.index);


    //     if (existWsocket) {
    //         console.log(existWsocket.readyState)
    //         if (existWsocket.readyState === WebSocket.OPEN) {
    //             const responseError = {
    //                 type: 'reg',
    //                 data: JSON.stringify({
    //                     error: true,
    //                     errorText:
    //                         'This user already exists',
    //                 }),
    //                 id: 0,
    //             };
    //             ws.send(JSON.stringify(responseError));
    //             return;
    //         }
    //         if (existWsocket.readyState === WebSocket.CLOSED) {
    //             const indexPlayers = Players.findIndex((player) => player.name === name && player.password === password);
    //             const indexRoom =  Rooms.findIndex(r=> r.roomUsers.find(u=> u.indexId === existUser.index))

    //             if (indexPlayers !== -1) {
    //                 Players.splice(indexPlayers, 1)
    //             }

    //             if (indexRoom !== -1) {
    //                 Rooms.splice(indexRoom, 1)
    //             }
    //         }
    //     }

    // }



    if (name.length < 5 || password.length < 5) {

        const responseError = {
            type: 'reg',
            data: JSON.stringify({
                error: true,
                errorText:
                    'Password and name should have a minimum 5 characters',
            }),
            id: 0,
        };

        ws.send(JSON.stringify(responseError));
        return;
    }

    /*Create player */
    const newPlayer: IPlayer = {
        name: name,
        password: password,
        wins: 0,
        index: ws.index,
    };

    let indexPlayer = Players.findIndex((player) => player.name === newPlayer.name);

    if (indexPlayer === -1) {
        indexPlayer = Players.length - 1;
    }


    const response: IResponse = {
        type: 'reg',
        data: JSON.stringify(
            {
                name,
                indexPlayer,
                error: false,
                errorText: 'error',
            }),
        id: request.id,
    };

    Players.push(newPlayer);

    //console.log(Players)

    if (Rooms.length > 0) {
        updateRoomList(ws);
    }

    ws.send(JSON.stringify(response));

};

