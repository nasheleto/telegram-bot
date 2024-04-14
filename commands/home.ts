import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"
import command from './command'

const meta: CommandMeta = {
    description: 'Дом', 
    pattern: /^\/?(home|дом)\s?.*$/,
}

const handler: Command = async (bot, { msg, invoker }) => {
    if (invoker === null) throw new InvokerMissingError()

        let text = `
        ${Date.now() - (invoker.lastBonusAt ?? 0) > (1000 * 60 * 60 * 24) ? '🟢': '🔴'} Бонус /bonus
${Date.now() - (invoker.lastPensionAt ?? 0) > (1000 * 60 * 60 * 24 * 7) ? '🟢': '🔴'} Пенсия /pension
        `
        await bot.sendMessage(msg.chat.id, text)
}

export default command(meta, handler)
