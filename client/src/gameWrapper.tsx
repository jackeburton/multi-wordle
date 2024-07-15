import { useParams } from "react-router-dom";
import Game from "./game";
import io from 'socket.io-client'
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const socket = io('http://localhost:3000')

type ConnectionInfo = {
    data: {}
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
            setIsValidGameId(isValid)
        })

        return () => {
            socket.off('validateGameId');
          };
    }, [])

    useEffect(() => {
        socket.on('connectToGame', (connectionInfo) => {
            setConnectionInfo(connectionInfo)
        })

        return () => {
            socket.off('connectToGame');
          };
    }, [])

    console.log(connectionInfo)

    if (connectionInfo?.message === 'game is full') {
        return (
        <div>
            {JSON.stringify(connectionInfo)}
        </div>)
    }

    if (isValidGameId) {
        return (
            <div>
                {JSON.stringify(connectionInfo)}
            <Game/>
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
