import { LangCode } from "./models/langs"

export const USER_ROLES = {
    player: 0,
    admin: 1
} as const

export const DEFAULT_LANG: LangCode = 'ru'