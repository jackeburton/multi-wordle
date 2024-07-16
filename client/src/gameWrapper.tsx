import { useParams } from "react-router-dom";
import Game from "./game";
import io from 'socket.io-client'
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Game1v1, Games } from '../../types/shared';

const socket = io('http://localhost:3000')

type ConnectionInfo = {
    data: {} | Game1v1
    message: string
}

function GameWrapper() {
    if (localStorage.getItem("storedData") === null){
        localStorage.setItem("storedData", JSON.stringify(uuidv4()));
    }

    const [userId, setUserId] = useState(localStorage.getItem("storedData"))
    const [isValidGameId, setIsValidGameId] = useState<null|boolean>(true)
    const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null)
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
        socket.on('connectToGame', (connectionInfo) => {
            console.log('connection info' + connectionInfo)
            setConnectionInfo(connectionInfo)
        })

        return () => {
            socket.off('connectToGame');
          };
    }, [])

    const checkGame = () => {
        socket.emit('checkGame', connectionInfo?.data)
    }

    useEffect(() => {
        socket.on('playerWin', (gameUpdateInfo) => {
            setConnectionInfo(prevState => (
                {...prevState, 
                data: {...prevState.data,
                    gameState: gameUpdateInfo
                }
                }))
        })
    })

    console.log(connectionInfo)

    if (connectionInfo?.message === 'game is full' || connectionInfo?.message === 'game not found') {
        return (
        <div>
            {JSON.stringify(connectionInfo)}
        </div>)
    }

    const playerFinish = (info) => {
        console.log(JSON.stringify(info))
        socket.emit('playerWin', {connectionInfo: connectionInfo,  userId: userId, info: info})
    }

    if (isValidGameId && connectionInfo) {
        return (
            <div>
                {JSON.stringify(connectionInfo.data.gameState)}
                {/*<button onClick={checkGame}>check game</button>*/}
                <Game gameInfo={connectionInfo.data} winCallback={playerFinish}/>
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

