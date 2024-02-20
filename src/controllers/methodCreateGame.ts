
import { IWebSocket } from '../types/types';

import { activePlayerId, gameCounter, gameInstances, gameParams, firstPlayerShips,
    secondPlayerShips} from '../state/game';
import { updateRoomList } from './methodUpdateRoom';



export const createGame = (id: number, ws: IWebSocket) => {

    const existGameInstance: gameParams = gameInstances.find(game => game.roomId === id) as gameParams;

    if (existGameInstance) {

        if (existGameInstance.wssockets.length >= 2) {
            console.log('There are already two players in the room');
            return;
        }
        existGameInstance.wssockets.push(ws);
        const gameId = id + ':' + existGameInstance.gameCounter;
        //existGameInstance.gameCounter++
        existGameInstance.firstPlayerShips = [];
        existGameInstance.secondPlayerShips = [];

        existGameInstance.wssockets.forEach((wssockets, index) => {

            const data = {
                idGame: gameId,
                idPlayer: index,
            };

            const response = {
                type: 'create_game',
                data: JSON.stringify(data),
                id: 0,
            };
            wssockets.send(JSON.stringify(response));
        });

        // if (existGameInstance.sockets.length === 2) {
        // }
    }

    else {
        gameInstances.push({
            roomId: id,
            wssockets: [ws],
            gameCounter,
            activePlayerId,
            firstPlayerShips,
            secondPlayerShips,
        });

    }
};
