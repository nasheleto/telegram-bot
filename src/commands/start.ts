import { Command, CommandMeta } from "../types"

import { createUser, getUserById, updateUser } from '../models/users'
import { formatMoney } from '../utils'
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
        await createUser({
            id: msg.from.id,
            nickname: msg.from.username ?? msg.from.first_name,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name ?? null,
            balance: 500,
            registeredAt: Date.now(),
            referrerId,
            role: 'player',
            langCode: langCode
        })
        user = await getUserById(msg.from.id)
    }

    if (user === null) {
        throw new Error('User does not exist')
    }
    
    await bot.sendSticker(msg.chat.id, 'https://chpic.su/_data/stickers/h/hdjajs78_h/hdjajs78_h_002.webp?v=1712145304')
    await reply(`${lang.start_hello[langCode]} ${user.nickname}. ${lang.balance[langCode]} $${formatMoney(user.balance)}`)
    await reply(`${lang.start_commands[langCode]}`)


    if(userExists || referrerId === undefined) return

    const referrer = await getUserById(referrerId)
    if (referrer === null) return

    await updateUser(referrerId, { balance: referrer.balance + 10000 })
    await bot.sendMessage(referrerId, `"${user.nickname}" ${lang.start_referral_bonus[langCode]} $${formatMoney(10000)}`)
}

export default command(meta, handler)
