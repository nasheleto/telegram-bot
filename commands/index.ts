import casino from './casino'

 const commands = {
    start: require('./start'), 
    info: require('./info'),
    balance: require('./balance'),
    game: require('./game'),
    nickname: require('./nickname'),
    casino: casino,
    bonus: require('./bonus'),
    pension: require('./pension'),
    home: require('./home'),
    ban: require('./ban'),
    give: require('./giveAdmin'),
    lang: require('./lang'),
    errors: require('./errors'),
    help: require('./help'),
}
export default commands