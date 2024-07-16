import { useEffect, useState } from "react"
import { ALL_CHARS, BACKSPACE_CHAR, Char, CORRECT_COLOUR, CORRECT_LOCATION_COLOUR, ENTER_CHAR, GameState, Guess, GuessedLetter, INCORRECT_COLOUR } from "./types/gameState"
import { ALL_WORDS } from "./types/validWordsList"
import Keyboard from "./keyboard"
import { Game1v1 } from "./types/gameState"

//const answer_ref = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)]

/*const genAnswer = (answer_pregen: string[]) => {
    const answer_array = []
    console.log(answer_pregen)
    for (const char of answer_pregen)
    return answer_array
}*/

type GameProps = {
    gameInfo: Game1v1,
    winCallback: (info) => void
}

function Game({gameInfo, winCallback} : GameProps) {
    const [answer, setAnswer] = useState(gameInfo.word)
    const [gameState, setGameState] = useState<GameState>([null, null, null, null, null])
    const [currentGuess, setCurrentGuess] = useState<Guess>(['', '', '', '', ''])
    const [boxStyle, setBoxStyle] = useState('h-16 w-16 border-solid border-2 border-gray-600 text-white m-1 align-middle inline-flex items-center justify-center text-2xl')
    const [hasWon, setHasWon] = useState<null|boolean>(null)
    const [guessedLetters, setGuessedLetters] = useState<GuessedLetter>({A : '', B : '' , C : '' , D : '' , E : '' , F : '' , G : '' , H : '' , I : '' , J : '' , K : '' 
, L : '' , M : '' , N : '' , O : '' , P : '' , Q : '' , R : '' , S : '' , T : '' , U : '' , V : '' , W : '' , X : '', Y : '', Z : ''})

    useEffect(() => {
        console.log('has won changed')
        console.log(hasWon)
        if (hasWon !== null){
            const callbackObj = {
                hasWon: hasWon,
                guesses: gameState.filter(guess => guess !== null).length
            }
            console.log('inside game obj ' + JSON.stringify(callbackObj))
            winCallback(callbackObj)
        }
    }, [hasWon])

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
            return false
        }

        const letterSliceFreq = guess.slice(0, index + 1).filter(char => char===letter).length
        const letterAnswerFreq = answer.filter(char => char===letter).length
        
        if (letterSliceFreq <= letterAnswerFreq ) {
            
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
                for (let i = 0; i < currentGuess.length ; i++) {
                    const colour = getLetterBGColour(currentGuess[i], currentGuess, i)
                    handleGuessedLetter(currentGuess[i], colour)
                }
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

    const getLetterBGColour = (char: string, guess: Guess ,index: number) => {
        if (answer[index] === char){
            return CORRECT_LOCATION_COLOUR
        } else if (yellowAtIndex(answer, guess, index)) {
            return CORRECT_COLOUR
        }
        return INCORRECT_COLOUR
    }

    const handleGuessedLetter = (letter: string, colour: string) => {
        let shouldUpdate = false

        if (guessedLetters[letter] === ''){
            shouldUpdate = true
        } if (guessedLetters[letter] === CORRECT_COLOUR && colour === CORRECT_LOCATION_COLOUR) {
            shouldUpdate = true
        }

        setGuessedLetters(letters => ({
            ...letters,
            ...(shouldUpdate && {[letter]: colour})
        }))
    }

    useEffect(() => {
        
    }, [guessedLetters])

    return (
        <div className="ml-auto mr-auto text-white">
            {hasWon === null ? <input className='h-0 w-0' name="keydown" autoFocus onBlur={e => e.target.focus()} onKeyDown={(e) => handleKeyDown(e)}/> : <div></div>}
            {gameState.map((guess, index) => (
                <div key={index} className="ml-auto mr-auto w-96 text-center">
                    <div className='inline-block'>
                {guess === null ? ['', '', '', '', ''].map((char, index) => (<span className={boxStyle} key={index}>{char}</span>))
                    : guess.map((char, index) => {
                        const colour = getLetterBGColour(char, guess, index)
                        const classname = boxStyle + " " + colour

                        return (
                            <span className={classname} key={index}>
                                {char}
                            </span>
                        )
                    }) 
                }
                </div>
                </div>
            ))}
            <div className="ml-auto mr-auto w-96 text-center">
            <div className="inline-block">
            {currentGuess.map((char, index) => (
                <span className={boxStyle} key={index}>{char}</span>
            ))}
            </div>
            </div>

            <Keyboard guessedLetters={guessedLetters}/>

            {hasWon === true ? <div>you won</div> : hasWon === false ? <div>you lost : {answer}</div> : <div></div>}
        </div>
    )
}

export default Game