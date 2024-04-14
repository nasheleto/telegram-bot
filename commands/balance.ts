import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"

import { formatMoney } from '../utils'
import command from './command'

const meta: CommandMeta = {
    description: 'Посмотреть свой баланс',  
    pattern: /^\/?(balance|баланс)$/
}

const handler: Command = async (bot, { msg, invoker }) => {
    if (invoker === null) throw new InvokerMissingError()
 
    await bot.sendMessage(msg.chat.id, `Твой баланс $${formatMoney(invoker.balance)}`)
}

export default command(meta, handler)
