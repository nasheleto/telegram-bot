import TelegramApi, { User as TelegramUser } from "node-telegram-bot-api";
import { USER_ROLES } from "./constants";
import { Lang, LangCode } from "./models/langs";
import { User } from "./models/users";

export type UserRole = keyof typeof USER_ROLES

export type LangService = Record<string, Record<string, string>>

export interface Services {
    lang: Lang
}

export type CommandMessage = TelegramApi.Message & {
    from: TelegramUser
}

export interface CommandMeta {
    description: string
    pattern: RegExp
    displayInMenu?: boolean
    role?: UserRole
}

export interface CommandContext {
    invoker: User | null
    msg: CommandMessage
    args: string[]
    langCode: LangCode
}

export type Command = (bot: TelegramApi, ctx: CommandContext, services: Services) => Promise<unknown>