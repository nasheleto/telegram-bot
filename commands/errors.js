const { getUserById } = require('../models/users')
const command = require('./command')
const { getErrors } = require('../models/errors')
const { USER_ROLE } = require('../constants')

const meta = {
    description: 'Посмотреть ошибки',
    pattern: /^\/?(errors|ошибки)$/,
    role: USER_ROLE.ADMIN
}

const handler = async (bot, msg) => {
    const user = await getUserById(msg.from.id)

    const errors = await getErrors()
    const toDisplay =  errors.slice(Math.max(errors.length - 10, 0))
    let text = toDisplay
        .map(error => `<b>${new Date(error.createdAt).toISOString()}</b> | ${error.message.substring(0, 32 - 3)}${error.message.length >= 32 ? '...' : ''}`)
        .join('\n')

    text = `1 - ${toDisplay.length} of ${errors.length}\n\n` + text

    await bot.sendMessage(msg.chat.id, text, {
        parse_mode: 'HTML'
    })
}

module.exports = command(meta, handler)
