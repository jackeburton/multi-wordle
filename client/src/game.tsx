import { useState } from "react"
import { ALL_CHARS, BACKSPACE_CHAR, Char, ENTER_CHAR, GameState, Guess } from "./types/gameState"
import { ALL_WORDS } from "./types/validWordsList"

const answer = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)]

function Game() {
    const [gameState, setGameState] = useState<GameState>([null, null, null, null, null])
    const [currentGuess, setCurrentGuess] = useState<Guess>(['', '', '', '', ''])
    const [boxStyle, setBoxStyle] = useState('h-20 w-20 border-solid border-2 border-gray-600 text-white m-1 align-middle inline-flex items-center justify-center text-2xl')

    const isWordValid = (guess: string[]) => {
        return ALL_WORDS.some(word => JSON.stringify(word) === JSON.stringify(guess))
    }

    const answerHasChar = (Char: Char) => {
        for (const answerChar of answer){
            if (answerChar === Char){
                return true
            }
        }
        return false
    }

    const handleGuess = () => {
        if (currentGuess.filter(letter => letter !== '').length === 5){
            if (isWordValid(currentGuess)){
                const newState = gameState.filter(guess => guess !== null).concat([currentGuess]).concat([null, null, null, null, null]).slice(0, 5) as GameState
                setGameState(newState)
                setCurrentGuess(['', '', '', '', ''])
            } else {
                const tempStyle = boxStyle
                setBoxStyle(boxStyle + ' animate-shake')
                setTimeout(function (){setBoxStyle(tempStyle)}, 1000);
            }
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

    console.log(answer)

    return (
        <div className="ml-auto mr-auto">
            <input className='h-0 w-0' name="keydown" autoFocus onBlur={e => e.target.focus()} onKeyDown={(e) => handleKeyDown(e)}/>
            {gameState.map((guess, index) => (
                <div key={index}>
                {guess === null ? ['', '', '', '', ''].map((char, index) => (<span className={boxStyle} key={index}>{char}</span>))
                    : guess.map((char, index) => {
                        let colour: string = ''
                        if (answer[index] === char){
                            colour = 'bg-green-500'
                        } else if (answerHasChar(char)) {
                            colour = 'bg-yellow-500'
                        }

                        const classname = boxStyle + " " + colour

                        return (
                            <span className={classname} key={index}>
                                {char}
                            </span>
                        )
                    }) 
                }
                </div>
            ))}
            <div>
            {currentGuess.map((char, index) => (
                <span className={boxStyle} key={index}>{char}</span>
            ))}
            </div>
        </div>
    )
}

export default Game