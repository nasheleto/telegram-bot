const lockfile = require('proper-lockfile');

(async () => {
    try {
        // apply lock
        console.log('FIRST PROGRAM: locking file');
        await lockfile.lock('./db/dev.json');
        // sleep to create condition where file is locked while second program running
        await new Promise(res => setTimeout(res, 20000))
        // do workS
        console.log('FIRST PROGRAM: writing to file');
     
        // release lock
        console.log('FIRST PROGRAM: release lock');
        await lockfile.unlock('./db/dev.json');
    } catch (error) {
        console.log(error);
    }
})();