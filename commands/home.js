const {getUserById} = require('../models/users')
const command = require('./command')

const meta = {
    description: 'Дом', 
    pattern: /^\/?(home|дом)\s?.*$/,
}

const handler = async (bot, msg) => {
    let user = await getUserById(msg.from.id)
        let text = `
        ${Date.now() - (user.lastBonusAt ?? 0) > (1000 * 60 * 60 * 24) ? '🟢': '🔴'} Бонус /bonus
${Date.now() - (user.lastPensionAt ?? 0) > (1000 * 60 * 60 * 24 * 7) ? '🟢': '🔴'} Пенсия /pension
        `
        await bot.sendMessage(msg.chat.id, text)
}

module.exports = command(meta, handler)
