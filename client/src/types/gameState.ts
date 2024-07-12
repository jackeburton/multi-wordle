export type GameState = (Guess | null)[]

export type Guess = [Char, Char, Char, Char, Char]

export const ALL_CHARS = ['A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' 
, 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X', 'Y', 'Z', ''] as const

export type Char = string

export const BACKSPACE_CHAR = ['Backspace']

export type BackspaceCharTuple = typeof BACKSPACE_CHAR

export type BackspaceChar = BackspaceCharTuple[number]

export const ENTER_CHAR = ['Enter']

export type EnterCharTuple = typeof ENTER_CHAR

export type EnterChar = EnterCharTuple[number]

export type GuessedLetter = {[letter: string] : string}

export const CORRECT_LOCATION_COLOUR = 'bg-green-500'
export const CORRECT_COLOUR = 'bg-yellow-500'
export const INCORRECT_COLOUR = 'bg-gray-1000'