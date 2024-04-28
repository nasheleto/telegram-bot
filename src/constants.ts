import { LangCode } from "./models/langs"
import { Resource } from "./types"

export const USER_ROLES = {
    player: 0,
    admin: 1
} as const
export const USER_ROLES_KEYS = Object.keys(USER_ROLES) as (keyof typeof USER_ROLES)[]

export const RESOURCES_KEYS = ['ice', 'sandstone', 'wood', 'clay', 'stone', 'food', 'money'] as const
export const RESOURCES: Record<typeof RESOURCES_KEYS[number], Resource> = {
    ice: { key: 'ice' },
    sandstone: { key: 'sandstone' },
    wood: { key: 'wood' },
    clay: { key: 'clay' },
    stone: { key: 'stone' },
    food: { key: 'food' },
    money: { key: 'money' },
}

export const DEFAULT_LANG: LangCode = 'ru'

// permute ['B', 'G', 'L', '7']
export const DICE_SLOT_COMBINATIONS = [["B","B","B"],["B","B","G"],["B","B","L"],["B","B","7"],["B","G","B"],["B","G","G"],["B","G","L"],["B","G","7"],["B","L","B"],["B","L","G"],["B","L","L"],["B","L","7"],["B","7","B"],["B","7","G"],["B","7","L"],["B","7","7"],["G","B","B"],["G","B","G"],["G","B","L"],["G","B","7"],["G","G","B"],["G","G","G"],["G","G","L"],["G","G","7"],["G","L","B"],["G","L","G"],["G","L","L"],["G","L","7"],["G","7","B"],["G","7","G"],["G","7","L"],["G","7","7"],["L","B","B"],["L","B","G"],["L","B","L"],["L","B","7"],["L","G","B"],["L","G","G"],["L","G","L"],["L","G","7"],["L","L","B"],["L","L","G"],["L","L","L"],["L","L","7"],["L","7","B"],["L","7","G"],["L","7","L"],["L","7","7"],["7","B","B"],["7","B","G"],["7","B","L"],["7","B","7"],["7","G","B"],["7","G","G"],["7","G","L"],["7","G","7"],["7","L","B"],["7","L","G"],["7","L","L"],["7","L","7"],["7","7","B"],["7","7","G"],["7","7","L"],["7","7","7"]]

