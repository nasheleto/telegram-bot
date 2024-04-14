import casino from './casino'
import game from './game'
import home from './home'
import info from './info'
import lang from './lang'
import nickname from './nickname'
import pension from './pension'
import start from './start'

 const commands = {
    start: start, 
    info: info,
    // balance: require('./balance'),
    game: game,
    nickname: nickname,
    casino: casino,
    // bonus: require('./bonus'),
    pension: pension,
    home: home,
    // ban: require('./ban'),
    // give: require('./giveAdmin'),
    lang: lang,
    // errors: require('./errors'),
    // help: require('./help'),
}

export default commands