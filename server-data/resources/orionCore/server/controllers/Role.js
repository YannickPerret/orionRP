const { AppDataSource } = require('../databases/database.js');

module.exports = {
    async isAdmin(playerId) {
        const userRepository = AppDataSource.getRepository('User');
        const user = await userRepository.findOne({
            where: { id: playerId },
            relations: ['role'],
        });

        if (user && user.role && user.role.name === 'admin') {
            return true;
        }
        return false;
    },

    async assignRoleToUser(userId, roleName) {
        const userRepository = AppDataSource.getRepository('User');
        const roleRepository = AppDataSource.getRepository('Role');

        const user = await userRepository.findOne({ where: { id: userId } });
        const role = await roleRepository.findOne({ where: { name: roleName } });

        if (user && role) {
            user.role = role;
            await userRepository.save(user);
            console.log(`Rôle ${roleName} assigné à l'utilisateur ${user.username}`);
            return true;
        }
        console.log('Utilisateur ou rôle introuvable');
        return false;
    }
};
