import { Command, CommandMeta } from "../types"

import chats from '../chats'
import { InvokerMissingError } from "../errors/commands"
import { gameOptions } from '../options'
import command from './command'

const meta: CommandMeta = {
    description: 'Игра',  
    pattern: /^\/?(game|игра|play)$/
}

const handler: Command = async (bot, { msg, invoker }) => {
    if (invoker === null) throw new InvokerMissingError()

    await bot.sendMessage(msg.chat.id, 'Сейчас я загадаю цифру от 0 до 9, и ты должен её угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[msg.chat.id] = randomNumber
    await bot.sendMessage(msg.chat.id, 'Можешь угадывать', gameOptions)
}

export default command(meta, handler)
