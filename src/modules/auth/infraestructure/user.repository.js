const mysql = require('mysql2/promise');
const dbConfig = require('../../../config/database');

class UserRepository {
    async findByEmail(email) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [users] = await connection.execute(
                'SELECT * FROM usuarios WHERE email = ?',
                [email]
            );
            return users[0] || null;
        } catch (error) {
            throw new Error('Error al buscar usuario por email');
        }
    }

    async findById(id) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [users] = await connection.execute(
                'SELECT * FROM usuarios WHERE id = ?',
                [id]
            );
            return users[0] || null;
        } catch (error) {
            throw new Error('Error al buscar usuario por ID');
        }
    }

    async create(userData) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                'INSERT INTO usuarios (email, password, nombre) VALUES (?, ?, ?)',
                [userData.email, userData.password, userData.nombre]
            );
            return { id: result.insertId, ...userData };
        } catch (error) {
            throw new Error('Error al crear usuario');
        }
    }
}

module.exports = new UserRepository(); 