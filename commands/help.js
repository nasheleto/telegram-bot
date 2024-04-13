const command = require('./command')

const meta = {
    description: 'Помощь',  
    pattern: /^\/?(help|помощь)$/,
    displayInMenu: false
}

const handler = async (bot, msg) => {
    const text = ''

    await bot.sendMessage(msg.chat.id, text)
}

module.exports = command(meta, handler)
