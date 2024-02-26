
import { WebSocket } from 'ws';

export interface IRequest {
    type: string;
    data: string;
    id: number;
}

export type IResponse = {
    type: string;
    data: string;
    id: number;
};


export interface IPlayer {
    name: string;
    password: string;
    index: string;
    wins: number;
}

export interface IWebSocket extends WebSocket {
    index?: string;
}

export interface IRoomUsers {
    name: string;
    index: number;
    indexId: string;
}

export interface IRoom {
    createBy: string;
    roomId: number;
    roomUsers: IRoomUsers[];
}

export interface IUpdateRoom {
    type: string;
    data: string;
    id: number;
}

export interface ITurn {
    type: string,
    data: string,
    id: number,
}

export type IShipType = 'small' | 'medium' | 'large' | 'huge';
export type IPositionType = 'miss' | 'killed' | 'shot';

export interface IPosition {
    x: number;
    y: number;
    type: string;
}

export interface IShip {
    position: IPosition,
    direction: boolean,
    length: number,
    type: IShipType
}

export interface IAddShipsData {
    gameId: number,
    ships: Array<IShip>,
    indexPlayer: number,
}

export interface IShipPosition {
    id: number,
    ships: IPosition[],
}

export interface IAttakaResult {
    shipState: string;
    shipCoordinates: { x: number; y: number }[],
    nextPlayer: number
}


export interface IPositionXY {
    x: number;
    y: number;
}
