export type Game1v1 = {
    id: string,
    user1Id: string | null,
    user2Id: string | null
}

export type Games = Game1v1[]

export type userConnectRequest = {
    id: string, 
    userId: string
}