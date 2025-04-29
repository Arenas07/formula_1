require('dotenv').config();

module.exports = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'formula1_user',
    password: process.env.DB_PASSWORD || 'formula1_password',
    database: process.env.DB_NAME || 'formula1_db',
    port: process.env.DB_PORT || 3306
}; 