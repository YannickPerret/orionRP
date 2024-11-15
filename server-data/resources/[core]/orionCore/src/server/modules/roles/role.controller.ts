import '@citizenfx/server';
import { ServerEvent, Inject } from '../../../core/decorators';
import { RoleService } from './role.service';
import {RoleType} from "./role.enum";


export class RoleController {
    @Inject(RoleService)
    private roleService!: RoleService;

    @ServerEvent('role:getAll')
    async handleGetAllRoles(playerId: number): Promise<void> {
        try {
            const roles = await this.roleService.getAllRoles();
            emitNet('orionCore:client:allRoles', playerId, roles);
        } catch (error) {
            console.error('Erreur lors de la récupération des rôles:', error);
            emitNet('orionCore:client:roleError', playerId, 'Erreur lors de la récupération des rôles');
        }
    }

    @ServerEvent('role:create')
    async handleCreateRole(playerId: number, roleName: RoleType): Promise<void> {
        try {
            const role = await this.roleService.createRole({ name: roleName });
            emitNet('orionCore:client:roleCreated', playerId, role);
            console.log(`Rôle ${role.name} créé avec succès.`);
        } catch (error) {
            console.error('Erreur lors de la création du rôle:', error);
            emitNet('orionCore:client:roleError', playerId, 'Erreur lors de la création du rôle');
        }
    }

    @ServerEvent('role:delete')
    async handleDeleteRole(playerId: number, roleId: string): Promise<void> {
        try {
            await this.roleService.deleteRoleById(roleId);
            emitNet('orionCore:client:roleDeleted', playerId, roleId);
            console.log(`Rôle avec l'ID ${roleId} supprimé avec succès.`);
        } catch (error) {
            console.error('Erreur lors de la suppression du rôle:', error);
            emitNet('orionCore:client:roleError', playerId, 'Erreur lors de la suppression du rôle');
        }
    }
}
