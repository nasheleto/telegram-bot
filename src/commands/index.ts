import balance from './balance'
import ban from './ban'
import bonus from './bonus'
import casino from './casino'
import errors from './errors'
import game from './game'
import giveAdmin from './giveAdmin'
import home from './home'
import info from './info'
import lang from './lang'
import nickname from './nickname'
import pension from './pension'
import slot from './slot'
import start from './start'

 const commands = {
    start: start, 
    info: info,
    balance: balance,
    game: game,
    nickname: nickname,
    casino: casino,
    bonus: bonus,
    pension: pension,
    home: home,
    ban: ban,
    give: giveAdmin,
    lang: lang,
    errors: errors,
    slot: slot,
}

export default commands