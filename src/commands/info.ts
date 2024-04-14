import { InvokerMissingError } from "../errors/commands"
import { Command, CommandMeta } from "../types"
import { formatMoney } from '../utils'
import command from './command'

import { updateUser } from '../models/users'

const meta: CommandMeta = {
    description: 'Информация',  
    pattern: /^\/?(info|инфо)$/
}

const handler: Command = async (bot, { msg, invoker }) => {
    if (invoker === null) throw new InvokerMissingError()

    await updateUser(msg.from.id, {lastName: msg.from.last_name, firstName: msg.from.first_name})

    const text = `
    Твой профиль:
    Роль: ${invoker.role ?? 'player'}
    Имя: ${invoker.firstName}
    Фамилия: ${invoker.lastName ?? "Нет"}
    Никнейм: ${invoker.nickname}
    Баланс: $${formatMoney(invoker.balance)}
    Дней со времени регистрации: ${Math.floor((Date.now() - invoker.registeredAt) / 1000 / 60 / 60 / 24)}
    `
    await bot.sendMessage(msg.chat.id, text)
}

export default command(meta, handler)
