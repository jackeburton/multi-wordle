import { useEffect, useState } from "react"
import { ALL_CHARS, BACKSPACE_CHAR, Char, ENTER_CHAR, GameState, Guess } from "./types/gameState"

function Game() {
    const [gameState, setGameState] = useState<GameState>([null, null, null, null, null])
    const [currentGuess, setCurrentGuess] = useState<Guess>(['', '', '', '', ''])

    useEffect(() => {
        console.log(gameState)
    }, [gameState])

    const handleGuess = () => {
        if (currentGuess.filter(letter => letter !== '').length === 5){
            const newState = gameState.filter(guess => guess !== null).concat([currentGuess]).concat([null, null, null, null, null]).slice(0, 5) as GameState
            setGameState(newState)
            setCurrentGuess(['', '', '', '', ''])
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (ALL_CHARS.includes(e.key.toUpperCase() as Char)){
            const key: Char = e.key.toUpperCase() as Char
            setCurrentGuess(currentGuess.filter(letter => letter !== '').concat([key]).concat(['', '', '', '', '']).slice(0, 5) as Guess)
        } else if (BACKSPACE_CHAR.includes(e.key as Char)){
            const filteredGuess = currentGuess.filter(letter => letter !== '')
            setCurrentGuess(filteredGuess.slice(0, filteredGuess.length - 1).concat(['', '', '', '', '']).slice(0, 5) as Guess)
        } else if (ENTER_CHAR.includes(e.key as Char)){
            handleGuess()
        }
    }

    return (
        <div className="ml-auto mr-auto">
            <input className='h-0 w-0' name="keydown" autoFocus onBlur={e => e.target.focus()} onKeyDown={(e) => handleKeyDown(e)}/>
            {gameState.map((guess, index) => (
                <div  key={index}>
                {guess === null ? ['', '', '', '', ''].map((char, index) => (<span className='inline-block h-20 w-20 border-solid border-2 border-gray-600' key={index}>{char}</span>))
                    : guess.map((char, index) => (<span className='inline-block h-20 w-20 border-solid border-2 border-gray-600 bg-slate-400' key={index}>{char}</span>)) 
                }
                </div>
            ))}
            <div className="max-h-20">
            {currentGuess.map((char, index) => (
                <div className="inline-block border-solid border-2 border-gray-600 bg-slate-400 min-h-20 min-w-20" key={index}>
                <span className="absolute" key={index}>{char}</span>
                </div>
            ))}
            </div>
        </div>
    )
}

export default Game