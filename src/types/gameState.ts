export type GameState = [
    Guess | null,
    Guess | null,
    Guess | null,
    Guess | null,
    Guess | null,
]

export type Guess = [Char, Char, Char, Char, Char]

//export type Char = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' 
//| 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X'

export const ALL_CHARS = ['A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' 
, 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X', 'Y', 'Z', ''] as const

export type CharTuple = typeof ALL_CHARS

export type Char = CharTuple[number]

export const BACKSPACE_CHAR = ['Backspace']

export type BackspaceCharTuple = typeof BACKSPACE_CHAR

export type BackspaceChar = BackspaceCharTuple[number]

export const ENTER_CHAR = ['Enter']

export type EnterCharTuple = typeof ENTER_CHAR

export type EnterChar = EnterCharTuple[number]
