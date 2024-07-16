
export type Game1v1 = {
    id: string,
    user1Id: string | null,
    user2Id: string | null
    word: string[]
    gameState: 'user 1 win' | 'user 2 win' | 'draw' | 'in play'
}


export type Games = Game1v1[]
