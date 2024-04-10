const {getUserById, updateUser} = require('../storage')
const command = require('./command')

const meta = {
    description: 'Пенсия', 
    pattern: /^\/?(pension|пенсия)\s?.*$/,
}

const formatTimeWeek = (time) => {
    const day = Math.floor((time / (1000 * 60 * 60 * 24)) % 7)
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((time / (1000 * 60)) % 60)
    const seconds = Math.floor((time / 1000) % 60)

    return `${day} дн. ${hours} ч. ${minutes} мин. ${seconds} сек.`
}

const handler = async (bot, msg) => {
    const user = await getUserById(msg.from.id)
    const week = 1000 * 60 * 60 * 24 * 7
    const time = Date.now() - (user.lastPensionAt ?? 0)

    if (time < week) {
        return bot.sendMessage(msg.from.id, `Пенсия еще недоступна, её можно забрать через ${formatTimeWeek(week - time)} `)
    }
    const x = Math.floor((Date.now() - user.registeredAt) / 1000 / 60 / 60 / 24 / 7 / 4)

    const update = {
        balance: user.balance + 500 * (x+1),
        lastPensionAt: Date.now()
    }

    await updateUser(msg.from.id, update)
    bot.sendMessage(msg.from.id, `Поздравляю! Пенсия $${500 * (x+1)} собрана. Теперь ваш баланс составляет $${update.balance}`)
}

module.exports = command(meta, handler)
