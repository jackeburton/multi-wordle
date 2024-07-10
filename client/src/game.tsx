import { useEffect, useState } from "react"
import { ALL_CHARS, BACKSPACE_CHAR, Char, ENTER_CHAR, GameState, Guess } from "./types/gameState"
import { ALL_WORDS } from "./types/validWordsList"

const answer_ref = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)]

let answer : string[] = []

for (const char of answer_ref) {
    answer.push(char)
}

function Game() {
    const [gameState, setGameState] = useState<GameState>([null, null, null, null, null])
    const [currentGuess, setCurrentGuess] = useState<Guess>(['', '', '', '', ''])
    const [boxStyle, setBoxStyle] = useState('h-20 w-20 border-solid border-2 border-gray-600 text-white m-1 align-middle inline-flex items-center justify-center text-2xl')
    const [hasWon, setHasWon] = useState<null|boolean>(null)

    useEffect(() => {
        const gameStateNoNulls = gameState.filter(guess => guess !== null)
        const lastGuess = gameStateNoNulls.at(-1)
        if (lastGuess) {
            let answerAndLastGuessSame = true
            for (let i = 0; i < lastGuess.length; i++) {
                if (lastGuess[i] !== answer[i]){
                    answerAndLastGuessSame = false
                }
            }
            if (answerAndLastGuessSame){
                setHasWon(true)
            } else if (gameStateNoNulls.length === 5) {
                setHasWon(false)
            }
        }
    }, [gameState])

    const isWordValid = (guess: string[]) => {
        return ALL_WORDS.some(word => JSON.stringify(word) === JSON.stringify(guess))
    }

    const isCharValid = (char: string) => {
        return ALL_CHARS.some(character => character === char)
    }

    const yellowAtIndex = (answer: string[], guess: Guess, index: number) => {
        const letter = guess[index]
        if (!answer.includes(letter)){
            console.log(letter)
            return false
        }
        //const letterGuessFreq = guess.filter(char => char===letter).length
        const letterSliceFreq = guess.slice(0, index + 1).filter(char => char===letter).length
        const letterAnswerFreq = answer.filter(char => char===letter).length

        /*console.log("guess", letter, letterSliceFreq)
        console.log("answer", letter, letterAnswerFreq)
        console.log(letterSliceFreq === letterAnswerFreq)
        console.log(guess.slice(0, index))*/
        
        if (letterSliceFreq <= letterAnswerFreq ) {
            /*console.log("guess", letter, letterSliceFreq)
            console.log("answer", letter, letterAnswerFreq)
            console.log(letterSliceFreq === letterAnswerFreq)
            console.log('')*/
            return true
        } else {
            return false
        }
    }

    const handleGuess = () => {
        if (currentGuess.filter(letter => letter !== '').length === 5){
            if (isWordValid(currentGuess)){
                const stateNoNullsCurrentGuess = gameState.filter(guess => guess !== null).concat([currentGuess]) as GameState
                const newState = stateNoNullsCurrentGuess.concat([null, null, null, null, null]).slice(0, 5) as GameState
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
        if (isCharValid(e.key.toUpperCase())){
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
        
        <div className="ml-auto mr-auto text-white">
            <div>{answer}</div>
            {hasWon === null ? <input className='h-0 w-0' name="keydown" autoFocus onBlur={e => e.target.focus()} onKeyDown={(e) => handleKeyDown(e)}/> : <div></div>}
            {gameState.map((guess, index) => (
                <div key={index}>
                {guess === null ? ['', '', '', '', ''].map((char, index) => (<span className={boxStyle} key={index}>{char}</span>))
                    : guess.map((char, index) => {
                        let colour: string = ''
                        if (answer[index] === char){
                            colour = 'bg-green-500'
                        } else if (yellowAtIndex(answer, guess, index)) {
                            colour = 'bg-yellow-500'
                        }

                        const classname = boxStyle + " " + colour

                        return (
                            <span className={classname} key={index}>
                                {char} {index}
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
            {hasWon === true ? <div>you won</div> : hasWon === false ? <div>you lost</div> : <div></div>}
        </div>
    )
}

export default Game