import { ALL_WORDS } from "../server/src/types/validWordsList"

export type WordTuple = typeof ALL_WORDS

export type Word = WordTuple[number]
