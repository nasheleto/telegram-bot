const {getUserById, updateUser} = require('../storage')
const {shuffle} = require('../utils')
const command = require('./command')

const meta = {
    description: 'Казино', 
    pattern: /^\/?(казино|casino)\s?.*$/,
    displayInMenu: false,
}

const handler = async (bot, msg, args) => {
    const user = await getUserById(msg.from.id)
    if (user === null) {
        return bot.sendMessage(msg.chat.id, 'Чтобы использовать эту команду, напишите /start')
    }

    const multipliers = [0, 0.5, 0, 0, 2, 5, 1, 1.5, 0.75, 0, 0.25, 10, 2, 100, 2, 5, 1, 0.7, 1, 0.9, 0.52]

    const bet = Number(args[0])

    if (Number.isNaN(bet)){
        return bot.sendMessage(msg.chat.id, 'Команда неправильно использована. Используйте /casino или /казино или казино <ставка>')
    }

    if (bet > user.balance) {
        return bot.sendMessage(msg.chat.id, "У вас недостаточно средств на балансе")
    }

    if (bet < 10) {
        return bot.sendMessage(msg.chat.id, "Минимальная ставка: $10")
    }

    for (let i = bet; i > 1; i = i / 1000) {
        multipliers.push(0)
        multipliers.push(0)
    }

    shuffle(multipliers)

    const random = Date.now() % multipliers.length
    const multiplier = multipliers[random]

    const result = multiplier * bet

    const update = {
        balance: user.balance - bet + result,
    }

    await updateUser(msg.from.id, update)

    bot.sendMessage(msg.chat.id, `Вам выпал X${multiplier}. Ваш баланс составляет $${update.balance}`)
}

module.exports = command(meta, handler)