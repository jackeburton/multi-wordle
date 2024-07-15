import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid';
import { Game1v1, Games, userConnectRequest } from './types/connection';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Replace with your React app URL
        methods: ["GET", "POST"]
    }
})

const getNewGameId = () => {
    const newGameId = uuidv4()
    console.log('Game ID:', newGameId);
    return newGameId
}

const games: Games = []

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('createGame', (userId) => {
        console.log('received create game request')
        const newGameid = getNewGameId()
        const game:Game1v1 = {id: newGameid, user1Id: userId, user2Id: null} 
        games.push(game)
        console.log(games)
        socket.emit('gameId', newGameid);    
    })
    
    socket.on('validateGameId', (gameId) => {
        let gameFound = false
        for (const game of games){
            if (gameId === game.id) {
                gameFound = true
                break
            }
        }
        socket.emit('validateGameId', gameFound);
    })

    socket.on('connectToGame', (userConnectRequest: userConnectRequest) => {
        let connectionInfo = ''
        games.forEach((game, index) => {
            if (game.id === userConnectRequest.id) {
                if (game.user1Id === userConnectRequest.userId){
                    connectionInfo = 'you are player 1'
                } else if (game.user2Id === userConnectRequest.userId){
                    connectionInfo = 'you are player 2'
                } else if (game.user1Id !== null && game.user2Id !== null){
                    console.log(typeof game.user2Id)
                    connectionInfo = 'game is full'
                } else {
                    connectionInfo = 'joined as player 2'
                    games[index].user2Id = userConnectRequest.userId;
                }
            }
        });
        socket.emit('connectToGame', {data: games , message: connectionInfo})
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});