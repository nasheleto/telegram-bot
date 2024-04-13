const {getUserById, updateUser} = require('../models/users')
const command = require('./command')
const {formatMoney} = require('../utils')

const meta = {
    description: 'Информация',  
    pattern: /^\/?(info|инфо)$/
}

const handler = async (bot, msg) => {
    await updateUser(msg.from.id, {lastName: msg.from.last_name, firstName: msg.from.first_name})
    const user = await getUserById(msg.from.id)
    const text = `
    Твой профиль:
    Привелегии: ${user.role ?? 'PLAYER'}
    Имя: ${user.firstName}
    Фамилия: ${user.lastName ?? "Нет"}
    Никнейм: ${user.nickname}
    Баланс: $${formatMoney(user.balance)}
    Дней со времени регистрации: ${Math.floor((Date.now() - user.registeredAt) / 1000 / 60 / 60 / 24)}
    `
    await bot.sendMessage(msg.chat.id, text)
}

module.exports = command(meta, handler)
