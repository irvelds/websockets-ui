
import { IPlayer, IResponse, IWebSocket } from '../types/types';
import { mapPlayers, Players, Rooms } from '../state/state';
import crypto from 'crypto';
import { updateRoomList } from './methodUpdateRoom';


export const methodRegistration = (ws: IWebSocket, request: any) => {

    const { name, password } = JSON.parse(request.data);

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

    /*Добавляем индекс соединению*/
    ws.index = crypto.randomUUID().toString();

    /*Create player */
    const newPlayer: IPlayer = {
        name: name,
        password: password,
        wins: 0,
        index: ws.index,
    };

    let index = Players.findIndex((el) => el.name === newPlayer.name);
    if (index === -1) {
        index = Players.length - 1;
    }
    const response: IResponse = {
        type: 'reg',
        data: JSON.stringify(
            {
                name,
                index,
                error: false,
                errorText: 'error',
            }),
        id: request.id,
    };

    Players.push(newPlayer);
    mapPlayers.set(ws, name);

    if (Rooms.length > 0) {
        updateRoomList(ws);
    }

    ws.send(JSON.stringify(response));

};

