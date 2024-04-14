export const LANG_CODES = ['ru', 'en'] as const
export type LangCode = typeof LANG_CODES[number]

export type Translation = Record<LangCode, string>

export const getLang = () => {
    return {
        "casino_invalid_command_error": {
            "ru": "Команда неправильно использована. Используйте \"казино <ставка>\"",
            "en": "Command is used incorrectly. Use \"casino <bet>\"",
        } satisfies Translation,

        "general_user_not_registered_error": {
            "ru": "Чтобы использовать эту команду, напишите \"старт\"",
            "en": "To use this command, type \"start\""
        } satisfies Translation,
        "general_command_not_found_error": {
            "ru": "Я тебя не понимаю",
            "en": "I don't understand you"
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