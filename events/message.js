const commands = require("../commands")
const { createError } = require("../models/errors")
const { getUserById } = require("../models/users")

const handler = (bot, services) => async (msg) => {
    try {
        // check user is banned
        const user = await getUserById(msg.from.id)
        if (user !== null && user.banExpiresAt > Date.now()) {
            return
        }

        // do not respond to images
        if (msg.text === undefined) {
            return bot.sendMessage(msg.chat.id, 'О, милота!')
        }

        // find command
        const [, ...args] = msg.text.replace('/', '').split(' ')
        const command = Object.values(commands).find(({ meta }) => meta.pattern.test(msg.text))
        if (command === undefined) {
            return await bot.sendMessage(msg.chat.id, 'Я тебя не понимаю')
        }

        // invoke the command
        await command.command(bot, msg, args, services)
    } catch (error) {
        console.error(error)

        try {
            await createError(error, msg)
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = handler