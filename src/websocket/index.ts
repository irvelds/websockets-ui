import { Server as WebSocketServer } from 'ws';
import { IRequest, IWebSocket } from '../types/types';
import { methodRegistration } from '../controllers/methodRegistration';
import { methodCreateRoom } from '../controllers/methodCreateRoom';
import { methodAddPlayerToRoom } from '../controllers/methodAddPlayerToRoom';
import { updateRoomList } from '../controllers/methodUpdateRoom';
import { methodStartGame } from '../controllers/methodStartGame';
import { methodAttack} from '../controllers/methodAttack';
import { methodUpdateWinners } from '../controllers/methodUpdateWinnersTable';



const webSocketPort = 3000;

export const clients = new Set<IWebSocket>();

export const wss = new WebSocketServer({
  port: webSocketPort,
});

wss.on('connection', (ws: IWebSocket) => {
  console.log(`WebSocket connected on the ${webSocketPort} webSocketPort`);
  clients.add(ws);
  // console.log(clients.size);
  ws.on('message', (msg: string) => {
    const request = JSON.parse(msg);

    // for(let client of clients) {
    //   client.send((msg));
    // }

    managementRequest(ws, request, msg);
  });
  ws.on('close', () => {
    console.log('WebSocket disconnected');
    clients.delete(ws);
  });
  ws.on('error', console.error);
});

export const managementRequest = (ws: IWebSocket, request: IRequest, msg: string) => {
  console.log(request);
  switch (request.type) {
    case 'reg':
      methodRegistration(ws, request);
      break;
    case 'update_winners':
      methodUpdateWinners();
      break;
    case 'create_room':
      methodCreateRoom(ws);
      break;
    case 'update_room':
      updateRoomList(ws);
      break;
    case 'add_user_to_room':
      methodAddPlayerToRoom(ws);
      break;
    case 'add_ships':
      methodStartGame(ws, msg);
      break;
    case 'attack':
      methodAttack(ws, msg);
      break;
  }
};


