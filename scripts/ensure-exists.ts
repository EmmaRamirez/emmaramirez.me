
    const fs = require('fs');

    const ensureExists = (path: string, mask?: any, cb?: any) => {
        if (typeof mask === 'function') {
        cb = mask;
        mask = 0o777;
        }
        fs.mkdir(path, mask, (err: any) => {
        if (err) {
            if (err.code === 'EEXIST') cb(null);
            else cb(err);
        } else {
            cb(null);
        }
        });
    };



module.exports = ensureExists;