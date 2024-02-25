
import { gameInstances, gameParams } from '../state/state';
import { Players } from '../state/state';
import { setActivePlayer } from '../controllers/methodStartGame';
import { IWebSocket, IAttakaResult, IPosition, IPositionXY, IShipPosition, } from '../types/types';
import { clients } from '../websocket';
import { methodUpdateWinners } from './methodUpdateWinnersTable';


export let activePlayer: number = 0;

export const generateRandomCoordinates = (): { x: number; y: number } => {
    const coordinates = {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
    };
    return coordinates;
};

export const methodAttack = (ws: IWebSocket, data: string, random: boolean = false) => {

    const parseData = JSON.parse(JSON.parse(data).data);
    const roomId = Number(parseData.gameId.slice(0, 1));
    const existGameInstance: gameParams = gameInstances.find(game => game.roomId === roomId) as gameParams;
    if (!existGameInstance || askIfGameFinished(existGameInstance)) {
        return;
    }
    if (!(existGameInstance.firstPlayerShips.ships && existGameInstance.secondPlayerShips.ships)) {
        return;
    }

    /*Атакуем*/
    if (random) {
        const coordinates = generateRandomCoordinates();
        const resultAttack = getAttack(parseData.indexPlayer, coordinates.x, coordinates.y, existGameInstance);

        const response = {
            type: 'attack',
            data: JSON.stringify({
                position: { x: coordinates.x, y: coordinates.y },
                currentPlayer: parseData.indexPlayer,
                status: resultAttack.shipState,
            }),
            id: 0,
        };
        existGameInstance.wssockets.forEach((wssocket) => {
            wssocket.send(JSON.stringify(response));
        });
    }

    if (!random) {

        if (activePlayer !== parseData.indexPlayer) {
            console.log('Next player goes');
            return;
        }

        const resultAttack = getAttack(parseData.indexPlayer, parseData.x, parseData.y, existGameInstance);

        const response = {
            type: 'attack',
            data: JSON.stringify({
                position: { x: parseData.x, y: parseData.y },
                currentPlayer: parseData.indexPlayer,
                status: resultAttack.shipState,
            }),
            id: 0,
        };
        existGameInstance.wssockets.forEach((wssocket) => {
            wssocket.send(JSON.stringify(response));
        });
    }

    /*Если игра закончилась*/

    if (askIfGameFinished(existGameInstance)) {

        const winnerId = getWinnerId(existGameInstance);

        const response = {
            type: 'finish',
            data: JSON.stringify({
                winPlayer: winnerId,
            }),
            id: 0,
        };

        clients.forEach((ws) => {
            ws.send(JSON.stringify(response));
        });
        // existGameInstance.wssockets.forEach((wssocket) => {
        //     wssocket.send(JSON.stringify(response));
        // });

        /*Увеличивает кол-во побед*/
        if (winnerId !== null) {
            const player = Players[winnerId];
            player.wins++;

        }


        methodUpdateWinners();


        /*Удаляем комнату*/

        // const roomId = (existGameInstance).roomId;

        // if (roomId) {
        //     const roomIndex = Rooms.findIndex((room) => room.roomId === roomId);

        //     if (roomIndex !== -1) {
        //         Rooms.splice(roomIndex, 1);
        //     }
        //     // removeRoom(roomId);
        //     updateRoomList(ws);

        //     // const response = {
        //     //     type: 'update_room',
        //     //     data: JSON.stringify([]),
        //     //     id: 0,
        //     // };
        //     // existGameInstance.wssockets.forEach((socket) => {
        //     //     socket.send(JSON.stringify(response));
        //     // });
        // }
    }
};

export const getShips = (indexPlayer: number, instanceGame: gameParams) => {
    switch (indexPlayer) {
        case 0:
            return instanceGame.firstPlayerShips;
        case 1:
            return instanceGame.secondPlayerShips;
        default: return [];
    }
};

export const getAttack = (indexPlayer: number, x: number, y: number, instanceGame: gameParams): IAttakaResult => {

    const enemyId = indexPlayer === 0 ? 1 : 0;
    const coordinates: IPositionXY[] = [];
    let shipState: string;
    const enemyDataShip = getShips(enemyId, instanceGame);

    /*если попал */
    enemyDataShip.ships.some((pos: IPosition, index: number) => {
        if (pos.x === x && pos.y === y && pos.type === 'miss') {
            pos.type = 'shot';
            coordinates.push({ x, y });
            openSurroundCells(enemyId, index, instanceGame);
        }
    }
    );

    if (!coordinates.length) {
        shipState = 'miss';
        coordinates.push({ x, y });
    } else {
        const isKilled = enemyDataShip.ships.every((pos: IPosition): boolean => {
            return pos.type === 'killed' || pos.type === 'shot';
        }
        );
        shipState = isKilled ? 'killed' : 'shot';
        coordinates.push({ x, y });
    }

    if (shipState === 'miss') {
        setActivePlayer(instanceGame);
    } else if (shipState === 'killed' || shipState === 'shot') {
        setActivePlayer(instanceGame, false);
    }

    const attackResult: IAttakaResult = {
        shipState,
        shipCoordinates: coordinates,
        nextPlayer: instanceGame.currentPlayerId,
    };

    activePlayer = instanceGame.currentPlayerId;

    instanceGame.wssockets.forEach((socket) => {
        socket.send(JSON.stringify({
            type: 'attack',
            data: JSON.stringify({
                position: { x, y },
                currentPlayer: indexPlayer,
                status: attackResult.shipState,
            }),
            id: 0,
        }));
    });

    return attackResult;
};


export const openSurroundCells = (indexPlayer: number, index: number, instanceGame: gameParams) => {
    const dataShips = getShips(indexPlayer, instanceGame);
    const isShipKilled = dataShips.ships[index].type === 'shot';

    if (isShipKilled) {
        const posX = dataShips.ships[index].x;
        const posY = dataShips.ships[index].y;
        const surroundCells = [
            { x: posX + 1, y: posY - 1 },
            { x: posX + 1, y: posY },
            { x: posX + 1, y: posY + 1 },
            { x: posX, y: posY + 1 },
            { x: posX, y: posY - 1 },
            { x: posX - 1, y: posY - 1 },
            { x: posX - 1, y: posY },
            { x: posX - 1, y: posY + 1 },
        ];



        surroundCells.forEach(((posCell: IPositionXY) => {
            if (dataShips.ships.some((posShip: IPositionXY) => posShip.x === posCell.x && posShip.y === posCell.y)) {
                return;
            }


            if (posCell.x < 10 && posCell.x >= 0 && posCell.y < 10 && posCell.y >= 0) {
                const enemyId = indexPlayer === 0 ? 1 : 0;
                instanceGame.wssockets[enemyId].send(
                    JSON.stringify({
                        type: 'attack',
                        data: JSON.stringify({
                            position: { x: posCell.x, y: posCell.y },
                            currentPlayer: enemyId,
                            status: 'miss',
                        }),
                        id: 0,
                    })
                );
            }
        }));

    }
};


export const getWinnerId = (instanceGame: gameParams): number | null => {

    const firstPlayerShips: IShipPosition  = instanceGame.firstPlayerShips as IShipPosition;
    const secondPlayerShips: IShipPosition = instanceGame.secondPlayerShips;

    if (firstPlayerShips.ships.every((ship) => ship.type === 'shot')) {
        return 1;
    }
    else if (secondPlayerShips.ships.every((ship) => ship.type === 'shot')) {
        return 0;
    }
    return null;

};


export const askIfGameFinished = (instanceGame: gameParams): boolean | null => {

    const firstPlayerShips: IShipPosition = instanceGame.firstPlayerShips as IShipPosition;
    const secondPlayerShips: IShipPosition = instanceGame.secondPlayerShips;

    if (!firstPlayerShips.ships || !secondPlayerShips.ships) {
        return null;
    }
    else {
        if (firstPlayerShips.ships.every((ship) => ship.type === 'shot') ||
            secondPlayerShips.ships.every((ship) => ship.type === 'shot')
        ) {
            return true;
        }
        return false;
    }

};











