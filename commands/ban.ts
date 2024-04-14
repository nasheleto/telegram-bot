import { Command, CommandMeta } from "../types"

import { InvokerMissingError } from "../errors/commands"
import { getUserByNickname, updateUser } from '../models/users'
import command from './command'

const meta: CommandMeta = {
    description: 'бан',  
    pattern: /^\/?(ban|бан)\s?.*$/,
    displayInMenu: false,
    role: 'admin'
}

const handler: Command = async (bot, { msg, args, invoker }) => {
    if (invoker === null) throw new InvokerMissingError()
    
    const nickname = args[0]
    const user = await getUserByNickname(nickname)
    if (user === null) {
        return bot.sendMessage(msg.chat.id, 'Такого пользователя нет')
    }

    let time

    const timeSpecifier = args[1]
    switch(timeSpecifier[timeSpecifier.length - 1]) {
        case 'd': time = parseInt(timeSpecifier) * 24 * 60 * 60 * 1000; break
        case 'h': time = parseInt(timeSpecifier) * 60 * 60 * 1000; break
        case 'm': time = parseInt(timeSpecifier) * 60 * 1000; break
        default: return await bot.sendMessage(msg.chat.id, 'Команда неправильно использована. Используйте /ban <ник юзера> <количество>')
    }

    if (Number.isNaN(time) || time < 0) {
        return bot.sendMessage(msg.chat.id, 'Команда неправильно использована. Используйте /ban <ник юзера> <количество (d, h, m)>')
    }

    const banExpiresAt = Date.now() + time
    await updateUser(user.id, {banExpiresAt})
    await bot.sendMessage(msg.chat.id, `Вы успешно забанили ${nickname} до ${new Date(banExpiresAt)}`)
}

export default command(meta, handler)
