import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"

import { updateUser } from '../models/users'
import * as utils from '../utils'
import command from './command'

const meta: CommandMeta = {
    description: 'Пенсия', 
    pattern: /^\/?(pension|пенсия)\s?.*$/,
}

const handler: Command = async (bot, { msg, invoker }) => {
    if (invoker === null) throw new InvokerMissingError()

    const week = 1000 * 60 * 60 * 24 * 7
    const time = Date.now() - (invoker.lastPensionAt ?? 0)

    if (time < week) {
        return bot.sendMessage(msg.from.id, `Пенсия еще недоступна, её можно забрать через ${utils.formatTimeWeek(week - time)} `)
    }
    const x = Math.floor((Date.now() - invoker.registeredAt) / 1000 / 60 / 60 / 24 / 7 / 4)

    const update = {
        balance: invoker.balance + 500 * (x+1),
        lastPensionAt: Date.now()
    }

    await updateUser(msg.from.id, update)
    bot.sendMessage(msg.from.id, `Поздравляю! Пенсия $${500 * (x+1)} собрана. Теперь твой баланс составляет $${utils.formatMoney(update.balance)}`)
}

export default command(meta, handler)
