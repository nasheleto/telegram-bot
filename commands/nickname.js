const {updateUser, getUserByNickname} = require('../storage')
const command = require('./command')

const meta = {
    description: 'Изменить никнейм',  
    pattern: /^\/?(nick|nickname|ник|никнейм)\s?.*$/,
    displayInMenu: true,
}

const handler = async (bot, msg, args) => {
    const nickname = args.join(' ')

    if (!nickname) {
        return await bot.sendMessage(msg.chat.id, `Невозможно установить такой никнейм. Попробуйте /nickname <ваш ник>`)
    }

    if (nickname.length > 16) {
        return await bot.sendMessage(msg.chat.id, `Невозможно установить никнейм. Максимальная длина никнейма 16 символов.`)
    }

    if (/^[\w\sа-я]+$/i.test(nickname) === false) {
        return await bot.sendMessage(msg.chat.id, `Невозможно установить никнейм. Используйте только буквы, цифры и нижнее подчеркивание`)
    }
    
    const user = await getUserByNickname(nickname)
    if (user === null) {
        const success = await updateUser(msg.from.id, {nickname})
        if (success) {
            await bot.sendMessage(msg.chat.id, `Вы изменили свой никнейм на ${nickname}`)
        } else {
            await bot.sendMessage(msg.chat.id, `Не удалось изменить никнейм`)
        }
    } else {
        if (user.id === msg.from.id) {
            await bot.sendMessage(msg.chat.id, `Вы уже использовали этот никнейм`)
        } else {
            await bot.sendMessage(msg.chat.id, `Этот никнейм уже использован`)
        }
    }
}

module.exports = command(meta, handler)
