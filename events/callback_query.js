const chats = require('../chats')
const commands = require('../commands')
const { getUserById, updateUser } = require('../models/users')
const { againOptions } = require('../options')
const { formatMoney } = require('../utils')

const handler = (bot) => async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
        return commands.game.command(bot, msg.message)
    }

    if (Number(data) === chats[chatId]) {
        let user = await getUserById(msg.from.id)
        await updateUser(msg.from.id, {
            balance: user.balance + 1500
        })
        user = await getUserById(msg.from.id)
        await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]} и выиграл $1500. Теперь твой баланс составляет $${formatMoney(user.balance)}`, againOptions)
        delete chats[chatId]
    }
    else if (chats[chatId] === undefined) {
        return bot.sendMessage(chatId, `Запусти /game или нажми на кнопку "Играть еще раз"`, againOptions)
    }
    else {
        await bot.sendMessage(chatId, `К сожалению, ты не угадал цифру ${chats[chatId]}`, againOptions)
        delete chats[chatId]
    }
}


module.exports = handler