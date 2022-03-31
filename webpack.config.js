const path = require('path');

module.exports = {
    entry: './client/game.js',
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: 'bundle.js',
    },
};