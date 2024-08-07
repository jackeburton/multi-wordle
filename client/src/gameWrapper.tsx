import { useParams } from "react-router-dom";
import Game from "./game";
import io from 'socket.io-client'
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Game1v1, GameResult, WinInfo } from './types/gameState'

const socket = io('http://localhost:3000')

type ConnectionInfo = {
    data: undefined | Game1v1
    message: string
}

function GameWrapper() {
    if (localStorage.getItem("storedData") === null){
        localStorage.setItem("storedData", JSON.stringify(uuidv4()));
    }

    const userId = localStorage.getItem("storedData")
    const [isValidGameId, setIsValidGameId] = useState<null|boolean>(true)
    const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null)
    const [game, setGame] = useState<Game1v1 | null>(null)
    const routeParams = useParams();
    console.log(routeParams)
    
    useEffect(() => {
        socket.emit('validateGameId', routeParams.gameId) 
        socket.emit('connectToGame', {id: routeParams.gameId, userId: userId})
    }, [])

    useEffect(() => {
        socket.on('validateGameId', (isValid: boolean) => {
            console.log('si valid game' + isValid)
            setIsValidGameId(isValid)
        })

        return () => {
            socket.off('validateGameId');
          };
    }, [])

    useEffect(() => {
        socket.on('connectToGame', (connectionInfo: false | ConnectionInfo) => {
            console.log('connection info:')
            console.log(connectionInfo)
            if (connectionInfo){
                setConnectionInfo(connectionInfo)
                if (connectionInfo.data){
                    console.log('connection info data')
                    console.log(connectionInfo.data)
                    setGame(connectionInfo.data)
                }
            } else {
                setConnectionInfo(
                    {data: undefined, message: 'game not found'}
                )
            }
        })

        return () => {
            socket.off('connectToGame');
          };
    }, [])

    useEffect(() => {
        socket.on('playerWin', (gameUpdateInfo: GameResult) => {
            if (game){
                setGame({...game, gameState: gameUpdateInfo})
            }
        })
    })

    console.log(connectionInfo)
    if (connectionInfo){
        if (connectionInfo?.message === 'game is full' || connectionInfo?.message === 'game not found') {
            return (
                <div>
                    {JSON.stringify(connectionInfo)}
                </div>)
        }
    }

    const playerFinish = (winInfo:WinInfo) => {
        console.log(JSON.stringify(winInfo))
        /*
        {
            hasWon: bool,
            guesses: number
        }
        */
        socket.emit('playerWin', {connectionInfo: connectionInfo,  userId: userId, info: winInfo})
    }

    console.log('GAME VARS ///')
    console.log(isValidGameId)
    console.log(connectionInfo)
    console.log(game)
    console.log('/// GAME VARS') 
    if (isValidGameId && connectionInfo && game) {
        return (
            <div>
                <div>{game.gameState}</div>
                <div>{connectionInfo.message}</div>
                <Game gameInfo={game} winCallback={playerFinish}/>
            </div>
        )
    }

    return(
        <div>
        not a valid game id
        </div>
    )
}

export default GameWrapper

