import { Command, CommandMeta } from "../types"

import { InvokerMissingError } from "../errors/commands"
import * as UserService from '../services/core/users'
import command from './command'

const meta: CommandMeta = {
    description: 'бан',  
    pattern: /^\/?(ban|бан)\s?.*$/,
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

    let time

    const timeSpecifier = args[1]
    switch(timeSpecifier[timeSpecifier.length - 1]) {
        case 'd': time = parseInt(timeSpecifier) * 24 * 60 * 60 * 1000; break
        case 'h': time = parseInt(timeSpecifier) * 60 * 60 * 1000; break
        case 'm': time = parseInt(timeSpecifier) * 60 * 1000; break
        default: return await reply(lang.ban_invalid_command_error[langCode])
    }

    if (Number.isNaN(time) || time < 0) {
        return reply(lang.ban_invalid_command_error[langCode])
    }

    const banExpiresAt = new Date(Date.now() + time)
    await UserService.update(user._id, { banExpiresAt })
    await reply(`${lang.ban_success_banned[langCode]} ${nickname} ${lang.ban_success_banned_until[langCode]} ${banExpiresAt}`)
}

export default command(meta, handler)
