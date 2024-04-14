import { Command, CommandMeta } from "../types"
import * as utils from '../utils'
import command from './command'

import { InvokerMissingError } from "../errors/commands"
import { updateUser } from '../models/users'

const meta: CommandMeta = {
    description: 'Бонус', 
    pattern: /^\/?(bonus|бонус)\s?.*$/,
}

const handler: Command = async (bot, { msg, invoker }) => {
    if (invoker === null) throw new InvokerMissingError()

    const day = 1000 * 60 * 60 * 24 
    const time = Date.now() - (invoker.lastBonusAt ?? 0)
    if (time < day) {
        return bot.sendMessage(msg.from.id, `Бонус еще недоступен, его можно забрать через ${utils.formatTime(day - time)}`)
    }
    const bonus = 1500
    const update = {
        balance: invoker.balance + bonus,
        lastBonusAt: Date.now()
    }
    await updateUser(msg.from.id, update)
    bot.sendMessage(msg.from.id, `Поздравляю! Бонус $1500 собран. Теперь твой баланс составляет $${utils.formatMoney(update.balance)}`)
}

export default command(meta, handler)
