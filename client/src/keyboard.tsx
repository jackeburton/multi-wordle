type KeyboardProps = {
    guessedLetters: { [letter: string] : string }
}

function Keyboard({guessedLetters} : KeyboardProps) {

    const qwertyArray = [ 
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
      ]
    
    const defaultClass = 'h-10 w-5 text-white m-0.5 align-middle inline-flex items-center justify-center rounded-md'
    const defaultBg = 'bg-gray-600'

    return (
        <div>
            {qwertyArray.map((row, index) => (
                <div key={index} className="ml-auto mr-auto w-96 text-center m-1 ">
                    <div className="inline-block">
                    {row.map((letter, index) => {
                        let keyBG = defaultClass
                        if (guessedLetters[letter] !== '') {
                            keyBG = keyBG + ' ' + guessedLetters[letter]
                        } else {
                            keyBG = keyBG + ' ' + defaultBg
                        }
                        return <span className={keyBG} key={index}>{letter}</span>
                    })}
                    </div>
                </div>
            ))}
        </div>
    )
}
export default Keyboard

