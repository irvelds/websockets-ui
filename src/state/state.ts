
import { IPlayer, IRoom, IWebSocket } from '../types/types';

export const Rooms: IRoom[] = [];
export const Players: IPlayer[] = [];

export const mapWsockets: IWebSocket[] = [];



export interface gameParams {
    roomId: number;
    wssockets: IWebSocket[];
    gameCounter: number;
    firstPlayerShips: any;
    secondPlayerShips: any;
    currentPlayerId: number;
}


export const gameInstances: Array<gameParams> = [];


export const wssockets: IWebSocket[] = [];
export const roomId: number = 0;
export const gameCounter: number = 0;
export const currentPlayerId: number = 0;





