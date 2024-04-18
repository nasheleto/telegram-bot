import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"

import { getUserByNickname, updateUser } from '../models/users'
import command from './command'

const meta: CommandMeta = {
    description: 'Изменить никнейм',  
    pattern: /^\/?(nick|nickname|ник|никнейм)\s?.*$/,
    displayInMenu: true,
}

const handler: Command = async (bot, { msg, args, invoker, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()

    const nickname = args.join(' ')

    if (!nickname) {
        return await reply(`${lang.nickname_empty_error[langCode]}`)
    }

    if (nickname.length > 16) {
        return await reply(`${lang.nickname_length_error[langCode]}`)
    }

    if (/^[\w\sа-я]+$/i.test(nickname) === false) {
        return await reply(`${lang.nickname_charset_error[langCode]}`)
    }
    
    const user = await getUserByNickname(nickname)
    if (user === null) {
        const success = await updateUser(msg.from.id, {nickname})
        if (success) {
            await reply(`${lang.nickname_change_success[langCode]} ${nickname}`)
        } else {
            await reply(`${lang.nickname_change_error[langCode]}`)
        }
    } else {
        if (user._id === msg.from.id) {
            await reply(`${lang.nickname_already_used_by_you[langCode]}`)
        } else {
            await reply(`${lang.nickname_already_used[langCode]}`)
        }
    }
}

export default command(meta, handler)
