const User = require('../../../usuario/infraestructure/repository/models/usuario.model');

class UserRepository {
    async findByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error('Error en UserRepository.findByEmail:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            console.error('Error en UserRepository.findById:', error);
            throw error;
        }
    }

    async create(userData) {
        try {
            const user = new User(userData);
            await user.save();
            return user;
        } catch (error) {
            console.error('Error en UserRepository.create:', error);
            throw error;
        }
    }

    async update(id, userData) {
        try {
            return await User.findByIdAndUpdate(id, userData, { new: true });
        } catch (error) {
            console.error('Error en UserRepository.update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error en UserRepository.delete:', error);
            throw error;
        }
    }
}

module.exports = new UserRepository();