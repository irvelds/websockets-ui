import { httpServer } from './src/http_server/index';
import 'dotenv/config';
import './src/websocket/index';
export const HTTP_PORT = parseInt(process.env.PORT || '8181');

console.log(`Start static http server on the ${HTTP_PORT} port!`);

httpServer.listen(HTTP_PORT);



