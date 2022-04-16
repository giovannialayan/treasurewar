require('dotenv').config();

const connections = {
    development: {
        http: {
            port: 3000,
        },
        mongo: process.env.MONGODB_URI || 'mongodb://localhost/TreasureWar',
        redis: process.env.REDISCLOUD_URL,
    },
    production: {
        http: {
            port: process.env.PORT || process.env.NODE_PORT,
        },
        mongo: process.env.MONGODB_URI,
        redis: process.env.REDISCLOUD_URL,
    }
};

module.exports = {
    connections: connections[process.env.NODE_ENV],
    secret: process.env.SESSION_SECRET
}