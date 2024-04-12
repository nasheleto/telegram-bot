const {getUserById, updateUser} = require('../models/users')
const command = require('./command')
const utils = require('../utils')

const meta = {
    description: 'Бонус', 
    pattern: /^\/?(bonus|бонус)\s?.*$/,
}

const handler = async (bot, msg) => {
    const user = await getUserById(msg.from.id)
    const day = 1000 * 60 * 60 * 24 
    const time = Date.now() - (user.lastBonusAt ?? 0)
    if (time < day) {
        return bot.sendMessage(msg.from.id, `Бонус еще недоступен, его можно забрать через ${utils.formatTime(day - time)}`)
    }
    const bonus = 1500
    const update = {
        balance: user.balance + bonus,
        lastBonusAt: Date.now()
    }
    await updateUser(msg.from.id, update)
    bot.sendMessage(msg.from.id, `Поздравляю! Бонус $1500 собран. Теперь твой баланс составляет $${utils.formatMoney(update.balance)}`)
}

module.exports = command(meta, handler)
