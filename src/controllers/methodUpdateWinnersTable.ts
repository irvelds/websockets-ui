
import { Players } from '../state/state';
import { clients, } from '../websocket';

export const methodUpdateWinners = () => {
    
    interface IWinner {
        name: string
        wins: number

    }
    const winnersTable: IWinner[] = [];
    Players.forEach((player) => {
        if (player.wins > 0) {
            winnersTable.push({ name: player.name, wins: player.wins });
        }
        return winnersTable;
    });

    if (winnersTable) {
        const response = {
            type: 'update_winners',
            data: JSON.stringify(winnersTable),
            id: 0,
        };
        clients.forEach((ws) => {
            ws.send(JSON.stringify(response));
        });
    }
};


