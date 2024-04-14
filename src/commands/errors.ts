import { InvokerMissingError } from "../errors/commands"
import { getErrors } from '../models/errors'
import { Command, CommandMeta } from "../types"

import command from './command'

const meta: CommandMeta = {
    description: 'Посмотреть ошибки',
    pattern: /^\/?(errors|ошибки)$/,
    role: "admin",
    displayInMenu: false
}

const handler: Command = async (bot, { msg, invoker }) => {
    if (invoker === null) throw new InvokerMissingError()

    const errors = await getErrors()
    const toDisplay =  errors.slice(Math.max(errors.length - 10, 0))
    let text = toDisplay
        .map(error => `<b>${new Date(error.createdAt).toISOString()}</b> | ${error.message.substring(0, 32 - 3)}${error.message.length >= 32 ? '...' : ''}`)
        .join('\n')

    text = `1 - ${toDisplay.length} of ${errors.length}\n\n` + text

    await bot.sendMessage(msg.chat.id, text, {
        parse_mode: 'HTML'
    })
}

export default command(meta, handler)
