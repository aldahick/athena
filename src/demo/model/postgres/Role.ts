import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RolePermission } from "./RolePermission";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => RolePermission, rp => rp.role)
  permissions!: RolePermission[];

  constructor(init?: Omit<Role, "id" | "permissions">) {
    Object.assign(this, init);
  }
}
