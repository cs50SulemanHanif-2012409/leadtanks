const logger = require('node-color-log');
const log = {
    error(message , line = ''){
        logger.color('red').bgColor('blue')
        .bold().italic().dim().reverse().underscore()
        .log(`[ERROR] [${line}] : ` , message);
    },
    print(message , line = ''){
        logger.color('green').bgColor('white')
        .bold().italic().dim().reverse().underscore()
        .log(`[LOG] [${line}] :` , message);
    },
    warn(message , line = ''){
        logger.color('yellow').bgColor('white')
        .bold().italic().dim().reverse().underscore()
        .log(`[WARN] [${line}] : ` , message);
    }
}
module.exports = log;