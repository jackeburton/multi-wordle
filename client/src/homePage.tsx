import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';

const socket = io('http://localhost:3000')

function HomePage() {
  const [gameLink, setGameLink] = useState<null|string>(null)
  const [gameId, setGameId] = useState<null|string>(null)
  const [connectId, setConnectId] = useState('')
  const [errorGettingGameId, setErrorGettingGameId] = useState(false)

  if (localStorage.getItem("storedData") === null){
    localStorage.setItem("storedData", JSON.stringify(uuidv4()));
  }

    const [userId, setUserId] = useState(localStorage.getItem("storedData"))

  useEffect(() => {
    socket.on('gameId', (newGameId: string) => {
      if (newGameId || newGameId !== ''){
        setGameLink('/game/' + newGameId)
        setGameId(newGameId)
        console.log('got new game Id')
        console.log(newGameId)
      } else {
        setErrorGettingGameId(true)
      }
    })

    return () => {
      socket.off('message');
    };
  }, [])

  const getGameId = () => {
    console.log('creating game')
    socket.emit('createGame', userId) 
  }


  if (gameLink !== null) {
    return(
    <div>
        <div>{gameLink}</div>
        <Link to={gameLink} state={gameId}>Start Game</Link>
    </div>)
  }

  return (
    <div className="text-white">
        <button onClick={getGameId}>new game</button>
        <input className="text-black" name="connectInput" onChange={(e) => setConnectId(e.target.value)}/>
        <Link to={'/game/' + connectId} state={gameId}>connect to Game</Link>
    </div>
  )

}

export default HomePage

