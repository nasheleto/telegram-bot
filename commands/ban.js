const { USER_ROLE } = require('../constants')
const {updateUser, getUserByNickname} = require('../models/users')
const command = require('./command')

const meta = {
    description: 'бан',  
    pattern: /^\/?(ban|бан)\s?.*$/,
    displayInMenu: false,
    role: USER_ROLE.ADMIN
}

const handler = async (bot, msg, args) => {
    const nickname = args[0]
    const user = await getUserByNickname(nickname)
    if (user === null) {
        return bot.sendMessage(msg.chat.id, 'Такого пользователя нет')
    }
    
    let time

    switch(args[1][args[1].length - 1]) {
        case 'd': time = parseInt(args[1]) * 24 * 60 * 60 * 1000; break
        case 'h': time = parseInt(args[1]) * 60 * 60 * 1000; break
        case 'm': time = parseInt(args[1]) * 60 * 1000; break
        default: return await bot.sendMessage(msg.chat.id, 'Команда неправильно использована. Используйте /ban <ник юзера> <количество>')
    }

    if (Number.isNaN(time) || time < 0) {
        return bot.sendMessage(msg.chat.id, 'Команда неправильно использована. Используйте /ban <ник юзера> <количество (d, h, m)>')
    }

    const banExpiresAt = Date.now() + time
    await updateUser(user.id, {banExpiresAt})
    await bot.sendMessage(msg.chat.id, `Вы успешно забанили ${nickname} до ${new Date(banExpiresAt)}`)
}

module.exports = command(meta, handler)
