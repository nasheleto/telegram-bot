import { DICE_SLOT_COMBINATIONS } from "../constants"
import { InvokerMissingError } from "../errors/commands"
import { updateUser } from "../models/users"
import { Command, CommandMeta } from "../types"
import command from './command'


const meta: CommandMeta = {
    description: 'Slot',  
    pattern: /^\/?(slot|слот)\s?.*$/,
    displayInMenu: false,
}

const handler: Command = async (bot, { msg, invoker, args, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()

    const bet = Number(args[0])
    if (Number.isNaN(bet)) {
        return reply(`Incorrect bet! Use /slot <bet>`)
    }

    const result = await bot.sendDice(msg.chat.id, {
        emoji: '🎰'
    })

    // 1 - 64
    const diceValue = result.dice?.value
    if (diceValue === undefined) {
        return
    }

    const combination = DICE_SLOT_COMBINATIONS[diceValue - 1]
    if (combination === undefined) {
        return
    }

    const isWinner = combination.some(c => c !== combination[0]) === false
    if (!isWinner) {
        await updateUser(msg.from.id, {
            balance: invoker.balance - bet
        })
        return
    }

    const winMap = {
        'G': 2,
        'L': 10,
        'B': 50,
        '7': 100
    }
    const symbol = combination[0] as keyof typeof winMap

    await updateUser(msg.from.id, {
        balance: invoker.balance + bet*winMap[symbol]
    })
    await reply(`🔥🔥🔥 You won X${winMap[symbol]} $${bet*winMap[symbol]} 🔥🔥🔥`)
}

export default command(meta, handler)
