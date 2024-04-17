import TelegramApi from "node-telegram-bot-api"
import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"
import command from './command'


const meta: CommandMeta = {
    description: 'Key',  
    pattern: /^\/?(key|клавиатура)$/
}

const handler: Command = async (bot, { msg, invoker, langCode, reply }, { lang }) => {
    if (invoker === null) throw new InvokerMissingError()

    const size = 8
    const keyboard: TelegramApi.InlineKeyboardButton[][] = []

    for (let y = 0; y < size; y++) {
        keyboard.push([])
        for (let x = 0; x < size; x++) {
            keyboard[y].push({
                text: (y + x) % 2 === 0 ? (y * size + x).toString() : '🏠',
                callback_data: (y * size + x).toString(),
            })
        }
    }

    keyboard[0][0].text = '↘️'

    console.log(keyboard[0].length, keyboard.length)
    await reply(`select`, {
        reply_markup: {
            inline_keyboard: keyboard,
        }
    })
}

export default command(meta, handler)
