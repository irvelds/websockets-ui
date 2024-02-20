import { IWebSocket } from '../types/types';

export interface gameParams {
    roomId: number;
    wssockets: IWebSocket[];
    gameCounter: number;
    firstPlayerShips: any;
    secondPlayerShips: any;
    activePlayerId: number;
}

export const gameInstances: Array<gameParams> = [];



export const wssockets: IWebSocket[] = [];
export const roomId: number = 0;
export const gameCounter: number = 0;
export const firstPlayerShips: any = [];
export const secondPlayerShips: any = [];
export const activePlayerId: number = 0;
