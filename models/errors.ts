import TelegramApi from 'node-telegram-bot-api'
import fs from 'node:fs/promises'
import path from 'path'
import { readJson } from '../utils'

const dbPath = path.resolve(__dirname, '..', 'db', 'errors.json')

export interface TrackedError {
    message: string
    stack?: string
    meta: TelegramApi.Message
    createdAt: number
}

export const getErrors = async () => {
    const errors = await readJson(dbPath, [])

    if (Array.isArray(errors)) {
        return errors as TrackedError[]
    } else {
        throw new Error(`"${dbPath}" has incorrect type.`)
    }
}

const writeErrors = async (errors: TrackedError[]) => {
    const json = JSON.stringify(errors, null, 2)

    return fs.writeFile(dbPath, json)
}

export const createError = async (error: Error, meta: TrackedError['meta']) => {
    const errors = await getErrors()

    errors.push({
        message: error.message,
        stack: error.stack,
        createdAt: Date.now(),
        meta
    })

    await writeErrors(errors)
}