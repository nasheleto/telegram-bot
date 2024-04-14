import TelegramApi from "node-telegram-bot-api"

import chats from '../chats'
import commands from '../commands'
import { DEFAULT_LANG } from "../constants"
import { getUserById, updateUser } from '../models/users'
import { againOptions } from '../options'
import { CommandMessage, Services } from "../types"
import { formatMoney } from '../utils'

const handler = (bot: TelegramApi, services: Services) => async (msg: TelegramApi.CallbackQuery) => {
    if (msg.message === undefined) return
    
    let user = await getUserById(msg.from.id)
    if (user === null) return

    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
        return commands.game.command(bot, {
            msg: msg.message as CommandMessage,
            args: [],
            invoker: user,
            langCode: user.langCode ?? DEFAULT_LANG,
        }, services)
    }

    if (Number(data) === chats[chatId]) {
        await updateUser(msg.from.id, { balance: user.balance + 1500 })
        user = await getUserById(msg.from.id)
        if (user === null) return

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


export default handler