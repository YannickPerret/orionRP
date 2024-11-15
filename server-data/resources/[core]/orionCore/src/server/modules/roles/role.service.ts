import { Inject, Injectable } from '../../../core/decorators';
import {PrismaService} from "../../../core/database/PrismaService";
import {RoleType} from "./role.enum";

@Injectable()
export class RoleService {
    @Inject(PrismaService)
    private prisma!: PrismaService;

    async getAllRoles() {
        return this.prisma.role.findMany();
    }

    async getRoleByName(name: RoleType) {
        return this.prisma.role.findUnique({
            where: {name},
        });
    }

    async createRole(roleData: { name: RoleType }) {
        return this.prisma.role.create({
            data: roleData,
        });
    }

    async deleteRoleById(roleId: string): Promise<void> {
        await this.prisma.role.delete({
            where: { id: roleId },
        });
    }
}
