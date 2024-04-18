import { Command, CommandMeta } from "../types"

import * as UserService from '../services/core/users'
import command from './command'

const meta: CommandMeta = {
    description: 'Приветствие и команды',
    pattern: /^\/?(start|старт)\s?.*$/,
}

const handler: Command = async (bot, { msg, args, invoker, langCode, reply }, { lang }) => {
    let user = invoker
    const userExists = user !== null
    const referrerId = args[0] !== undefined ? Number(args[0]) : undefined
    if (!userExists) {
        user = await UserService.create({
            _id: msg.from.id,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name ?? null,
            referrerId,
            langCode: langCode
        })
    }

    if (user === null) {
        throw new Error('Unexpected error: user does not exist')
    }

    await bot.sendSticker(msg.chat.id, 'https://chpic.su/_data/stickers/h/hdjajs78_h/hdjajs78_h_002.webp?v=1712145304')
    await reply(`${lang.start_hello[langCode]} ${user.nickname}. ${lang.balance[langCode]} $0`)
    await reply(`${lang.start_commands[langCode]}`)


    // TODO: handle referral bonus
    // if(userExists || referrerId === undefined) return

    // const referrer = await UserService.findById(referrerId)
    // if (referrer === null) return
    
    // UserService.update(referrerId, { balance })
    // await updateUser(referrerId, { balance: referrer.balance + 10000 })
    // await bot.sendMessage(referrerId, `"${user.nickname}" ${lang.start_referral_bonus[langCode]} $${formatMoney(10000)}`)
}

export default command(meta, handler)
