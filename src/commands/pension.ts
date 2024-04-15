import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"

import { updateUser } from '../models/users'
import * as utils from '../utils'
import command from './command'

const meta: CommandMeta = {
    description: 'Пенсия', 
    pattern: /^\/?(pension|пенсия)\s?.*$/,
}

const handler: Command = async (bot, { msg, invoker, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()

    const week = 1000 * 60 * 60 * 24 * 7
    const time = Date.now() - (invoker.lastPensionAt ?? 0)

    if (time < week) {
        return reply(`${lang.pension_not_available[langCode]} ${utils.formatTimeWeek(week - time)} `)
    }
    const x = Math.floor((Date.now() - invoker.registeredAt) / 1000 / 60 / 60 / 24 / 7 / 4)

    const update = {
        balance: invoker.balance + 500 * (x+1),
        lastPensionAt: Date.now()
    }

    await updateUser(msg.from.id, update)
    reply(`${lang.pension_has_been_collected_pt1[langCode]} $${500 * (x+1)} ${lang.pension_has_been_collected_pt2[langCode]} $${utils.formatMoney(update.balance)}`)
}

export default command(meta, handler)
