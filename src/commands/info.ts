import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"
import command from './command'

import * as UserService from '../services/core/users'

const meta: CommandMeta = {
    description: 'Информация',  
    pattern: /^\/?(info|инфо)$/
}

const handler: Command = async (bot, { msg, invoker, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()

    await UserService.update(msg.from.id, { lastName: msg.from.last_name, firstName: msg.from.first_name })

    const text = `
    ${lang.info_profile[langCode]}
    ${lang.info_profile_role[langCode]} ${invoker.role ?? 'player'}
    ${lang.info_profile_name[langCode]} ${invoker.firstName}
    ${lang.info_profile_lastname[langCode]} ${invoker.lastName ?? `${lang.general_no[langCode]}`}
    ${lang.info_profile_nickname[langCode]} ${invoker.nickname}
    ${lang.info_profile_registration_days[langCode]} ${Math.floor((Date.now() - invoker.registeredAt.getTime()) / 1000 / 60 / 60 / 24)}
    `
    await reply( text)
}

export default command(meta, handler)
