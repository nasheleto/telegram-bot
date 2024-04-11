const {getUserById, updateUser, getUserByNickname} = require('../storage')
const command = require('./command')
const {formatMoney} = require('../utils')

const meta = {
    description: 'бан',  
    pattern: /^\/?(ban|бан)\s?.*$/,
    displayInMenu: false,
}

const handler = async (bot, msg, args) => {
    const nickname = args[0]
    const user = await getUserByNickname(nickname)
    if (user === null) {
        return bot.sendMessage(msg.chat.id, 'Такого пользователя нет')
    }
    
    const days = Number(args[1]) * 24 * 60 * 60 * 1000
    if (Number.isNaN(days) || days < 0) {
        return bot.sendMessage(msg.chat.id, 'Команда неправильно использована. Используйте /ban <ник юзера> <количество дней>')
    }
    const banExpiresAt = Date.now() + days
    await updateUser(user.id, {banExpiresAt})
    await bot.sendMessage(msg.chat.id, `Вы успешно забанили ${nickname} до ${new Date(banExpiresAt)}`)
}

module.exports = command(meta, handler)
