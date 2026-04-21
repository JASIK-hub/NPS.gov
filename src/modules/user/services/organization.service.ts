import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/core/base/service/base.service";
import { OrganizationEntity } from "src/core/db/entities/organization.entity";
import { Repository } from "typeorm";
@Injectable()
export class OrganizationService extends BaseService<OrganizationEntity>{
    constructor(@InjectRepository(OrganizationEntity) repository:Repository<OrganizationEntity>){
        super(repository)
    }
}