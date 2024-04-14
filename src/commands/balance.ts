import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"

import { formatMoney } from '../utils'
import command from './command'

const meta: CommandMeta = {
    description: 'Посмотреть свой баланс',  
    pattern: /^\/?(balance|баланс)$/
}

const handler: Command = async (bot, { msg, invoker, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()
 
    await reply(`${lang.balance[langCode]} $${formatMoney(invoker.balance)}`)
} 

export default command(meta, handler)
