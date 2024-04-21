import { Command, CommandMeta } from "../types"
import command from './command'

const meta: CommandMeta = {
    description: 'Дом', 
    pattern: /^\/?(home|дом)\s?.*$/,
}

const handler: Command = async (bot, { msg, invoker, langCode, reply }, { lang }) => {
    throw new Error('Not implemented')
//     if (invoker === null) throw new InvokerMissingError()

//         let text = `
//         ${Date.now() - (invoker.lastBonusAt ?? 0) > (1000 * 60 * 60 * 24) ? '🟢': '🔴'} ${lang.home_bonus[langCode]}
// ${Date.now() - (invoker.lastPensionAt ?? 0) > (1000 * 60 * 60 * 24 * 7) ? '🟢': '🔴'} ${lang.home_pension[langCode]}
//         `
//         await reply(text)
}

export default command(meta, handler)
