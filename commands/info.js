const {getUserById} = require('../storage')
const command = require('./command')

const meta = {
    description: 'Информация',  
    pattern: /^\/?(info|инфо)$/
}

const handler = async (bot, msg) => {
    let user = await getUserById(msg.from.id)
    let text = `
    Твой профиль:
    Имя: ${user.firstName}
    Фамилия: ${user.lastName ?? `Нет`}
    Никнейм: ${user.nickname}
    Баланс: $${user.balance}
    Дней со времени регистрации: ${Math.floor((Date.now() - user.registeredAt) / 1000 / 60 / 60 / 24)}
    `
    await bot.sendMessage(msg.chat.id, text)
}

module.exports = command(meta, handler)