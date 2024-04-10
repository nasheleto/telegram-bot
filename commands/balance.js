const {getUserById} = require('../storage')
const command = require('./command')

const meta = {
    description: 'Посмотреть свой баланс',  
    pattern: /^\/?(balance|баланс)$/
}

const handler = async (bot, msg) => {
    const user = await getUserById(msg.from.id)
    await bot.sendMessage(msg.chat.id, `Ваш баланс $${user.balance}`)
}

module.exports = command(meta, handler)