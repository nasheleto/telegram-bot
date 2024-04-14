import fs from 'node:fs/promises'
import path from 'path'
import { UserRole } from '../types'
import { readJson } from '../utils'
import { LangCode } from './langs'

export interface User {
    id: number
    nickname?: string
    firstName: string
    lastName: string | null
    balance: number
    role?: UserRole
    langCode: LangCode
    referrerId?: number
    registeredAt: number
    lastBonusAt?: number 
    lastPensionAt?: number
    banExpiresAt?: number
}

const dbPath = path.resolve(process.cwd(), 'db', 'users.json')

export const getUsers = async () => {
    const users = await readJson(dbPath, [])

    if (Array.isArray(users)) {
        return users as User[]
    } else {
        throw new Error(`"${dbPath}" has incorrect type.`)
    }
}

const writeUsers = async (users: User[]) => {
    const json = JSON.stringify(users, null, 2)

    return fs.writeFile(dbPath, json)
}

export const createUser = async (user: User) => {
    const users = await getUsers()
    users.push(user)

    return writeUsers(users)
}

export const getUserById = async (id: number) => {
    const users = await getUsers()
    const user = users.find((u) => u.id === id)
    return user ?? null
}


export const countUsers = async () => {
    return (await getUsers()).length
}

export const updateUser = async (id: number, update: Partial<User>) => {
    const users = await getUsers()
    const foundIndex = users.findIndex((m) => m.id === id)
    const foundUser = users[foundIndex]
   
    if (foundUser === undefined) {
        return false
    }

    if (update.balance !== undefined) {  
        update.balance = Math.round((update.balance + Number.EPSILON) * 100) / 100
    }

    users[foundIndex] = { ...foundUser, ...update }

    await writeUsers(users)

    return true
}

export const getUserByNickname = async (nickname: string) => {
    const users = await getUsers()
    const user = users.find((u) => u.nickname === nickname)
    return user ?? null
}
