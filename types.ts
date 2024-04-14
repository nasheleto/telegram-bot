import TelegramApi, { User } from "node-telegram-bot-api";

export type CommandMessage = TelegramApi.Message & {
    from: User
}

export interface Services {
    lang: LangService
}

export type Command = (bot: TelegramApi, msg: CommandMessage, args: string[], services: Services) => Promise<unknown>

export type LangService = Record<string, Record<string, string>>

export interface CommandMeta {
    description: string
    pattern: RegExp
    displayInMenu?: boolean
    role?: number
}