const fs = require('fs');

const logs = (req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('cannot write server.log');
        }
    });
    next();
};

module.exports = { logs };