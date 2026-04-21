import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('organization')
export class OrganizationEntity{
    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id:number
    
    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @Column({ unique: true, length: 12 })
    bin: string;

    @ApiProperty()
    @Column({ nullable: true })
    name: string; 

    @OneToMany(() => UserEntity, (user) => user.organization)
    users: UserEntity[]
}