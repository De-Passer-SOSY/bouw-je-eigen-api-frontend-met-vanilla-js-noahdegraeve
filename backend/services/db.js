const knex = require('knex');
const db = knex({
    client: 'mysql2',
    connection: {
        host: 'web0164.zxcs.be',
        user: 'adb_noah',
        password: 'bhhBGXdaAhTJxj8muDGm',
        database: 'adb_voorbeeld'
    }
})

module.exports = db;