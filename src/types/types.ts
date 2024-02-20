

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
    roomId: number;
    roomUsers: IRoomUsers[];
}

export interface IUpdateRoom {
    type: string;
    data: string;
    id: number;
}


