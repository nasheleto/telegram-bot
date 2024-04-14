import { InvokerMissingError } from "../errors/commands"
import { LANG_CODES, LangCode } from "../models/langs"
import { Command, CommandMeta } from "../types"

import { updateUser } from '../models/users'
import command from './command'

const meta: CommandMeta = {
    description: 'Поменять язык',  
    pattern: /^\/?(lang|язык)\s?.*$/
}

const handler: Command = async (bot, { msg, args, langCode, invoker }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()

    const code = args[0] as LangCode 

    if (!LANG_CODES.includes(code)) {
        let text = `${lang.lang_switch_error[langCode]} ${code} \n`
        text += `${lang.lang_available_languages[langCode]}:\n`
        text += `${LANG_CODES.join('\n')}`
        return await bot.sendMessage(msg.from.id, text)
    }

    await updateUser(msg.from.id, {langCode: code})
    await bot.sendMessage(msg.from.id, `${lang.lang_switch_success[code]} ${code}`)
}

export default command(meta, handler)
