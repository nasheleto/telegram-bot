import { Command, CommandMeta } from "../types"
import * as utils from '../utils'
import command from './command'

import { InvokerMissingError } from "../errors/commands"
import { updateUser } from '../models/users'

const meta: CommandMeta = {
    description: 'Бонус', 
    pattern: /^\/?(bonus|бонус)\s?.*$/,
}

const handler: Command = async (bot, { msg, invoker, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()

    const day = 1000 * 60 * 60 * 24 
    const time = Date.now() - (invoker.lastBonusAt ?? 0)
    if (time < day) {
        return reply(`${lang.bonus_not_available[langCode]} ${utils.formatTime(day - time)}`)
    }
    const bonus = 1500
    const update = {
        balance: invoker.balance + bonus,
        lastBonusAt: Date.now()
    }
    await updateUser(msg.from.id, update)
    reply(`${lang.bonus_has_been_collected[langCode]} $${utils.formatMoney(update.balance)}`)
}

export default command(meta, handler)
