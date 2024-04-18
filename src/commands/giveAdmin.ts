import { InvokerMissingError } from "../errors/commands"
import * as UserService from '../services/core/users'
import { Command, CommandMeta } from "../types"

import command from './command'

const meta: CommandMeta = {
    description: 'Выдать права администратора',  
    pattern: /^\/?(выдать|give|забрать)\s?.*$/,
    displayInMenu: false,
    role: 'admin'
}

const handler: Command = async (bot, { msg, args, invoker, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()
    
    const nickname = args[0]
    const user = await UserService.findNyNickname(nickname)
    if (user === null) {
        return reply(lang.general_user_not_found_error[langCode])
    }
    const isAdmin = !msg.text.startsWith('забрать')
    await UserService.update(user._id, { role: isAdmin ? 'admin' : 'player' })
    await reply(`${isAdmin ? lang.giveAdmin_gave[langCode] : lang.giveAdmin_removed[langCode]} ${nickname}`)
}

export default command(meta, handler)
