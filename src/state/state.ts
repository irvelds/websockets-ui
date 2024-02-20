
import { IPlayer, IRoom, IWebSocket } from '../types/types';

export const mapPlayers = new Map<IWebSocket, string>();
export const Rooms: IRoom[] = [];
export const Players: IPlayer[] = [];
