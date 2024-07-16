import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid';
import { userConnectRequest } from './types/connection';
import { Game1v1, Games } from '../../types/shared';
import { ALL_WORDS } from "../../types/validWordsList"

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

const getNewWord = () => {
    const answer_ref = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)]
    let answer_pregen : string[] = []

    for (const char of answer_ref) {
        answer_pregen.push(char)
    }

    return answer_pregen
}

const games: Games = []

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('createGame', (userId) => {
        console.log('received create game request')
        const newGameid = getNewGameId()
        socket.join(newGameid);
        const game:Game1v1 = {id: newGameid, user1Id: userId, user2Id: null, word: getNewWord(), gameState: 'in play'} 
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

    socket.on('playerWin', (winInfo) => {
        console.log(winInfo)
        const wonGameinfo = winInfo.connectionInfo.data
        const winningUserId = winInfo.userId
        console.log(games)
        console.log(wonGameinfo)
        let gameInfo
        games.some((game, index) => {
            if (game.id === wonGameinfo.id) {
                if (game.user1Id === winningUserId){
                    games[index].gameState = 'user 1 win'
                    gameInfo = games[index].gameState
                } else if(game.user2Id === winningUserId){
                    games[index].gameState = 'user 2 win'
                    gameInfo = games[index].gameState
                }
            }
        })
        console.log(games)
        io.to(wonGameinfo.id).emit('playerWin', gameInfo)
    })

    socket.on('checkGame', (ConnectionInfo) => {
        console.log(ConnectionInfo)
        let update = ''
        games.some((game, index) => {
            if (game.id === ConnectionInfo.id) {
                update = game.gameState
            }
        })
        socket.emit('gameUpdate', update)
    })

    socket.on('connectToGame', (userConnectRequest: userConnectRequest) => {
        let connectionInfo = ''
        let gameToFind = {}

        games.some((game, index) => {
            if (game.id === userConnectRequest.id) {
                console.log('found game')
                if (game.user1Id === userConnectRequest.userId){
                    connectionInfo = 'you are player 1'
                    socket.join(game.id);
                    gameToFind = games[index]
                } else if (game.user2Id === userConnectRequest.userId){
                    connectionInfo = 'you are player 2'
                    socket.join(game.id);
                    gameToFind = games[index]
                } else if (game.user2Id === null){
                    connectionInfo = 'joined as player 2'
                    games[index].user2Id = userConnectRequest.userId;
                    socket.join(game.id);
                    gameToFind = games[index]
                } 
            }
        });
        if (Object.keys(gameToFind).length !== 0){
            console.log('emitting to ' + userConnectRequest.id)
            socket.emit('connectToGame', {data: gameToFind , message: connectionInfo})
        } else {
            socket.emit('connectToGame', {data: {} , message: 'game not found'})
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});