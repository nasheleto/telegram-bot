import ban from './ban'
import errors from './errors'
import giveAdmin from './giveAdmin'
import home from './home'
import info from './info'
import key from './key'
import lang from './lang'
import nickname from './nickname'
import slot from './slot'
import start from './start'

 const commands = {
    start: start, 
    info: info,
    nickname: nickname,
    home: home,
    ban: ban,
    give: giveAdmin,
    lang: lang,
    errors: errors,
    slot: slot,
    key
}

export default commands