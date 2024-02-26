
import { gameParams, gameInstances } from '../state/state';
import { IAddShipsData, IShipPosition, ITurn, IWebSocket, IShip, IPosition } from '../types/types';


const getCoordinates = (data: IAddShipsData) => {
    const shipCoordinates: IPosition[] = [];
    data.ships.forEach((ship: IShip) => {
        const { x: posX, y: posY } = ship.position;
        if (ship.direction) {
            for (let i = 0; i < ship.length; i++) {
                const pos = {
                    x: posX,
                    y: posY + i,
                    type: 'miss',
                };
                shipCoordinates.push(pos);
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                const pos = {
                    x: posX + i,
                    y: posY,
                    type: 'miss',
                };
                shipCoordinates.push(pos);
            }
        }

    });
    return shipCoordinates;
};

export const getDataShip = (data: IAddShipsData) => {

    const dataShips: IShipPosition = {
        id: data.indexPlayer,
        ships: []
    };
    const coordinates = getCoordinates(data);
    dataShips.ships.push(...coordinates);
    return dataShips;
};



export const methodStartGame = (ws: IWebSocket, resp: string) => {

    const parseData = JSON.parse(JSON.parse(resp).data);
    const roomId = Number(parseData.gameId.slice(0, 1));
    const existGameInstance: gameParams = gameInstances.find(game => game.roomId === roomId) as gameParams;

    const ships = getDataShip(parseData);

    if (parseData.indexPlayer === 0) {
        existGameInstance.firstPlayerShips = ships;
    } else if (parseData.indexPlayer === 1) {
        existGameInstance.secondPlayerShips = ships;
    }


    const response = {
        type: 'start_game',
        data: JSON.stringify({
            ships: parseData.ships,
            currentPlayerIndex: parseData.indexPlayer,
        }),
        id: 0,
    };
    ws.send(JSON.stringify(response));
    setActivePlayer(existGameInstance);
};




export function setActivePlayer(instanceGame: gameParams, changePlayer: boolean = true) {
    if (changePlayer) {
        instanceGame.currentPlayerId = instanceGame.currentPlayerId === 0 ? 1 : 0;
    }
    // else {
    //     instanceGame.currentPlayerId = instanceGame.currentPlayerId;
    // }
    const response: ITurn = {
        type: 'turn',
        data: JSON.stringify({
            currentPlayer: instanceGame.currentPlayerId,
        }),
        id: 0,
    };

    instanceGame.wssockets.forEach((wssocket) => {
        wssocket.send(JSON.stringify(response));
    });
}



