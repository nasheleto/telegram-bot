import { InvokerMissingError } from "../errors/commands"
import { getUserByNickname, updateUser } from '../models/users'
import { Command, CommandMeta } from "../types"

import command from './command'

const meta: CommandMeta = {
    description: 'Выдать права администратора',  
    pattern: /^\/?(выдать|give|забрать)\s?.*$/,
    displayInMenu: false,
    role: 'admin'
}

const handler: Command = async (bot, { msg, args, invoker }) => {
    if (invoker === null) throw new InvokerMissingError()
    
    const nickname = args[0]
    const user = await getUserByNickname(nickname)
    if (user === null) {
        return bot.sendMessage(msg.from.id, `Такого пользователя не существует`)
    }
    const isAdmin = !msg.text.startsWith('забрать')
    await updateUser(user.id, { role: isAdmin ? 'admin' : 'player' })
    await bot.sendMessage(msg.from.id, `Вы ${isAdmin ? 'дали' : 'забрали'} админку ${nickname}`)
}

export default command(meta, handler)
