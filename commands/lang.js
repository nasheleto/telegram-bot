const {getUserById, updateUser} = require('../models/users')
const command = require('./command')

const meta = {
    description: 'Поменять язык',  
    pattern: /^\/?(lang|язык)\s?.*$/
}

const handler = async (bot, msg, args, {lang}) => {
    const user = await getUserById(msg.from.id)
    const langs = ['ru', 'en']
    const code = args[0]
    if (!langs.includes(code)) {
        let text = `${lang.lang_switch_error[user.lang ?? msg.from.language_code ?? "en"]} ${code} \n`
        text += `${lang.lang_available_languages[user.lang ?? msg.from.language_code ?? "en"]}:\n`
        text += `${langs.join('\n')}`
        return await bot.sendMessage(msg.from.id, text)
    }
    await updateUser(msg.from.id, {lang: code})
    await bot.sendMessage(msg.from.id, `${lang.lang_switch_success[code]} ${code}`)
}

module.exports = command(meta, handler)
