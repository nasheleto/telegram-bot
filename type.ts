interface User {
    id: number
    nickname?: string
    firstName: string
    lastName: string | null
    balance: number
    registeredAt: number
    lastBonusAt?: number 
    lastPensionAt?: number
    role?: 'ADMIN' | 'PLAYER'
    lang?: string
    banExpiresAt?: number
}

const user: User = {
    nickname: 'Xenia',
    balance: 20,
    lastName: null,
    id: 1,
    firstName: 'Ksyusha',
    registeredAt: 2,
}
console.log(user)