export const LANG_CODES = ['ru', 'en'] as const
export type LangCode = typeof LANG_CODES[number]

export type Translation = Record<LangCode, string>

export const getLang = () => {
    return {
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
        "general_no": {
            "ru": "Нет",
            "en": "No"
        } satisfies Translation,

        "balance": {
            "ru": "Твой баланс:",
            "en": "Your balance:",
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

        "bonus_not_available": {
            "ru": "Бонус еще недоступен, его можно забрать через",
            "en": "The bonus is not available yet, it can be collected in"
        } satisfies Translation,
        "bonus_has_been_collected": {
            "ru": "Поздравляю! Бонус $1.500 собран. Теперь твой баланс составляет",
            "en": "Congratulations! The $1.500 bonus has been collected. Now your balance is"
        } satisfies Translation,

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

        "game_start": {
            "ru": "Сейчас я загадаю цифру от 0 до 9, и ты должен её угадать",
            "en": "Now I will pick a number from 0 to 9 and you will need to guess it",
        } satisfies Translation,

        "giveAdmin_gave": {
            "ru": "Вы дали админку",
            "en": "You gave a admin",
        } satisfies Translation,
        "giveAdmin_removed": {
            "ru": "Вы забрали админку",
            "en": "You removed a admin",
        } satisfies Translation,

        "home_bonus": {
            "ru": "Бонус /bonus",
            "en": "Bonus /bonus",
        } satisfies Translation,
        "home_pension": {
            "ru": "Пенсия /pension",
            "en": "Pension /pension",
        } satisfies Translation,

        "info_profile": {
            "ru": "Твой профиль:",
            "en": "Your profile:",
        } satisfies Translation,
        "info_profile_role": {
            "ru": "Роль:",
            "en": "Role:",
        } satisfies Translation,
        "info_profile_name": {
            "ru": "Имя:",
            "en": "Name:",
        } satisfies Translation,
        "info_profile_lastname": {
            "ru": "Фамилия:",
            "en": "Last name:",
        } satisfies Translation,
        "info_profile_nickname": {
            "ru": "Никнейм:",
            "en": "Nickname:",
        } satisfies Translation,
        "info_profile_balance": {
            "ru": "Баланс:",
            "en": "Balance:",
        } satisfies Translation,
        "info_profile_registration_days": {
            "ru": "Дней со времени регистрации:",
            "en": "Days from the time of registration:",
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
        } satisfies Translation,

        "nickname_empty_error": {
            "ru": "Невозможно установить такой никнейм. Используйте /nickname <твой ник>",
            "en": "It is impossible to set such a nickname. Use /nickname <your nickname>"
        } satisfies Translation,
        "nickname_length_error": {
            "ru": "Невозможно установить никнейм. Максимальная длина никнейма - 16 символов.",
            "en": "It is impossible to set such a nickname. The maximum length of a nickname is 16 characters."
        } satisfies Translation,
        "nickname_charset_error": {
            "ru": "Невозможно установить никнейм. Используйте только буквы, цифры и нижнее подчеркивание",
            "en": "It is impossible to set such a nickname. Use only letters, numbers, and underscores"
        } satisfies Translation,
        "nickname_change_success": {
            "ru": "Вы изменили свой никнейм на",
            "en": "You have changed your nickname to"
        } satisfies Translation,
        "nickname_change_error": {
            "ru": "Не удалось изменить никнейм",
            "en": "Failed to change nickname"
        } satisfies Translation,
        "nickname_already_used_by_you": {
            "ru": "Вы уже использовали этот никнейм",
            "en": "Have you already used this nickname"
        } satisfies Translation,
        "nickname_already_used": {
            "ru": "Этот никнейм уже использован",
            "en": "This nickname has already been used"
        } satisfies Translation,

        "pension_not_available": {
            "ru": "Пенсия еще недоступна, её можно забрать через",
            "en": "The pension is not available yet, it can be collected in"
        } satisfies Translation,
        "pension_has_been_collected_pt1": {
            "ru": "Поздравляю! Пенсия",
            "en": "Congratulations! The pension"
        } satisfies Translation,
        "pension_has_been_collected_pt2": {
            "ru": "собрана. Теперь твой баланс составляет",
            "en": "has been collected. Now your balance is"
        } satisfies Translation,

        "start_hello": {
            "ru": "Привет,",
            "en": "Hello,"
        } satisfies Translation,
        "start_commands": {
            "ru": `Доступные команды: 
        /start — Стартовая команда
        /info — Вся информация про пользователя
        /balance — Посмотреть свой баланс
        /lang ►язык◄ — Изменить язык. Доступны ru, en
        /game — Игра
        /nickname ►твой ник◄ — Изменить ник
        /casino ►ставка◄ (например "казино 100") — Казино
        /bonus — Забрать бонус (доступен каждые 24 часа)
        /pension — Забрать пенсию  (доступна каждую неделю)
        /home — Доступные бонусы и задания`,

            "en": `Available commands: 
        /start — The starting command
        /info — All information about the user
        /balance — View your balance
        /lang ►language◄ — Change the language. Available ru, en
        /game — Game
        /nickname ►your nickname◄ — Change the nickname
        /casino ►bet◄ (for example, "casino 100") — Casino
        /bonus — To collect the bonus (available every 24 hours)
        /pension — To collect the pension (available every week)
        /home — Available bonuses and tasks`
        } satisfies Translation,
        "start_referral_bonus": {
            "ru": "зарегистрировался по вашей ссылке! Вы получили бонус",
            "en": "registered with your link! You got a bonus"
        } satisfies Translation,
    }
}

export type Lang = ReturnType<typeof getLang>