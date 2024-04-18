import { InvokerMissingError } from '../errors/commands'
import { updateUser } from '../models/users'
import { Command, CommandMeta } from '../types'
import { formatMoney, shuffle } from '../utils'
import command from './command'

const meta: CommandMeta = {
    description: 'Казино', 
    pattern: /^\/?(казино|casino)\s?.*$/,
    displayInMenu: false,
}

const handler: Command = async (bot, { msg, args, invoker, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()

    const multipliers = [0, 0.5, 0, 0, 2, 5, 1, 1.5, 0.75, 0, 0.25, 10, 2, 100, 2, 5, 1, 0.7, 1, 0.9, 0.52]

    const bet = Number(args[0])

    if (Number.isNaN(bet)){
        return reply(lang.casino_invalid_command_error[langCode])
    }

    if (bet > invoker.balance) {
        return reply(lang.casino_not_enough_money[langCode])
    }

    if (bet < 10) {
        return reply(lang.casino_minimum_bet[langCode])
    }

    for (let i = bet; i > 1; i = i / 1000) {
        multipliers.push(0)
        multipliers.push(0)
    }

    shuffle(multipliers)

    const random = Date.now() % multipliers.length
    const multiplier = multipliers[random]

    const result = multiplier * bet

    const update = {
        balance: invoker.balance - bet + result,
    }

    const updateResult = await updateUser(msg.from.id, update)
    if (!updateResult) {
        return reply(`Something went wrong.`)
    }

    await reply(`${lang.casino_got_chance[langCode]} X${multiplier}. ${lang.casino_balance[langCode]} $${formatMoney(update.balance)}`)
}

export default command(meta, handler)
