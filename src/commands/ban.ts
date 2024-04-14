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

const handler: Command = async (bot, { msg, args, invoker, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()
    
    const nickname = args[0]
    const user = await getUserByNickname(nickname)
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

    const banExpiresAt = Date.now() + time
    await updateUser(user.id, {banExpiresAt})
    await reply(`${lang.ban_success_banned[langCode]} ${nickname} ${lang.ban_success_banned_until[langCode]} ${new Date(banExpiresAt)}`)
}

export default command(meta, handler)
