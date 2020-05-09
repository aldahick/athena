import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role";

@Entity()
export class RolePermission {
  @PrimaryColumn()
  roleId!: number;

  @JoinColumn({ name: "roleId" })
  @ManyToOne(() => Role, r => r.permissions, { nullable: false })
  role!: Promise<Role>;

  @PrimaryColumn()
  resource!: string;

  @PrimaryColumn()
  action!: string;

  @PrimaryColumn()
  attributes!: string;

  constructor(init?: Omit<RolePermission, "role">) {
    Object.assign(this, init);
  }
}
