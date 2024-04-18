import TelegramApi from "node-telegram-bot-api"
import { CommandContext, CommandMessage, Services } from "../types"

import commands from "../commands"
import { DEFAULT_LANG, USER_ROLES } from "../constants"
import { InvokerMissingError } from "../errors/commands"
import { createError } from "../models/errors"
import { User } from "../models/users"
import * as UserService from "../services/core/users"

const handler = (bot: TelegramApi, services: Services) => async (msg: TelegramApi.Message) => {
    let user: User | null = null

    try {
        // check telegram user is present
        const telegramUser = msg.from
        if (telegramUser === undefined) {
            return
        }

        // check user is banned
        user = await UserService.findById(telegramUser.id)
        if (user?.banExpiresAt && user.banExpiresAt.getTime() > Date.now()) {
            return
        }

        // do not respond to non-text messages, e.g. images
        const text = msg.text
        if (text === undefined) {
            return bot.sendMessage(msg.chat.id, 'О, милота!')
        }

        // find command
        const [, ...args] = text.replace('/', '').split(' ')
        const command = Object.values(commands).find(({ meta }) => meta.pattern.test(text))
        if (command === undefined) {
            return await bot.sendMessage(msg.chat.id, services.lang.general_command_not_found_error[user?.langCode ?? DEFAULT_LANG])
        }

        // check user has access to the command
        if (command.meta.role !== undefined) {
            const userRole = USER_ROLES[user?.role ?? 'player']
            const requiredRole = USER_ROLES[command.meta.role]

            if (userRole < requiredRole) return
        }

        // invoke the command
        const context: CommandContext = {
            msg: msg as CommandMessage,
            args,
            invoker: user,
            langCode: user?.langCode ?? DEFAULT_LANG,
            reply: (text, options) => bot.sendMessage(msg.chat.id, text, options)
        }
        await command.command(bot, context, services)
    } catch (e) {
        const error = e as Error

        if (error instanceof InvokerMissingError) {
            return await bot.sendMessage(msg.chat.id, services.lang.general_user_not_registered_error[user?.langCode ?? DEFAULT_LANG])
        }

        console.error(error)

        try {
            await createError(error, msg)
        } catch (error) {
            console.error(error)
        }
    }
}

export default handler