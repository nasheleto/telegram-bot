export const LANG_CODES = ['ru', 'en'] as const
export type LangCode = typeof LANG_CODES[number]

export type Translation = Record<LangCode, string>

export const getLang = () => {
    return {
        "casino_invalid_command_error": {
            "ru": "Команда неправильно использована. Используйте \"казино <ставка>\"",
            "en": "Command is used incorrectly. Use \"casino <bet>\"",
        } satisfies Translation,
        "casino_not_enough_money": {
            "ru": "У вас недостаточно средств на балансе",
            "en": "You dont have enough money on your balance",
        } satisfies Translation,
        "casino_minimum_bet": {
            "ru": "Минимальная ставка: $10",
            "en": "Minimum bet: $10",
        } satisfies Translation,
        "casino_got_chance": {
            "ru": "Выпал",
            "en": "You got",
        } satisfies Translation,
        "casino_balance": {
            "ru": "Твой баланс составляет",
            "en": "Your balance is",
        } satisfies Translation,

        "balance": {
            "ru": "Твой баланс",
            "en": "Your balance",
        } satisfies Translation,
        
        "general_user_not_registered_error": {
            "ru": "Чтобы использовать эту команду, напишите \"старт\"",
            "en": "To use this command, type \"start\""
        } satisfies Translation,
        "general_command_not_found_error": {
            "ru": "Я тебя не понимаю",
            "en": "I don't understand you"
        } satisfies Translation,
        "general_user_not_found_error": {
            "ru": "Такого пользователя не существует",
            "en": "There is no such user"
        } satisfies Translation,
    
        "ban_invalid_command_error": {
            "ru": "Команда неправильно использована. Используйте /ban <ник юзера> <количество>",
            "en": "Command is used incorrectly. Use /ban <user's nickname> <count (d, h, m)>"
        } satisfies Translation,
        "ban_success_banned": {
            "ru": "Вы успешно забанили",
            "en": "You have successfully banned"
        } satisfies Translation,
        "ban_success_banned_until": {
            "ru": "до",
            "en": "until"
        } satisfies Translation,
        
        "lang_switch_success": {
            "ru": "Вы поменяли язык на",
            "en": "You switched language to"
        } satisfies Translation,
        "lang_switch_error": {
            "ru": "Такого языка не существует",
            "en": "This language does not exist"
        } satisfies Translation,
        "lang_available_languages": {
            "ru": "Доступные языки",
            "en": "Available languages"
        } satisfies Translation
    }
}

export type Lang = ReturnType<typeof getLang>