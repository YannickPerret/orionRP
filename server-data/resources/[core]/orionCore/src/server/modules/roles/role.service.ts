import { getRepository } from 'typeorm';
import { Role, RoleType } from './role.entity';

export class RoleService {
    async getAllRoles(): Promise<Role[]> {
        return await getRepository(Role).find();
    }

    async getRoleByName(name: RoleType): Promise<Role | undefined> {
        return await getRepository(Role).findOne({ where: { name } });
    }

    async createRole(roleData: Partial<Role>): Promise<Role> {
        const role = getRepository(Role).create(roleData);
        await getRepository(Role).save(role);
        return role;
    }

    async deleteRoleById(roleId: number): Promise<void> {
        await getRepository(Role).delete(roleId);
    }
}
