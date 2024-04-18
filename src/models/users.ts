import mongoose from 'mongoose'
import { UserRole } from '../types'
import { LangCode } from './langs'

export interface User {
    _id: number
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

export const createUser = async (user: User) => {
    const result = await mongoose.connection.collection<User>('users').insertOne(user)

    return result.acknowledged
}

export const getUserById = async (id: number) => {
    return mongoose.connection.collection<User>('users').findOne({
        _id: id
    })
}

export const countUsers = async () => {
    return mongoose.connection.collection<User>('users').countDocuments()
}

export const updateUser = async (id: number, update: Partial<User>) => {
    if (update.balance !== undefined) {  
        update.balance = Math.round((update.balance + Number.EPSILON) * 100) / 100
    }

    const result = await mongoose.connection.collection<User>('users').updateOne(
        { _id: id },
        {
            $set: update,
        }
    )

    return result.modifiedCount !== 0
}

export const getUserByNickname = async (nickname: string) => {
    return mongoose.connection.collection<User>('users').findOne({
        nickname
    })
}
