import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegionEntity } from "src/core/db/entities/region.entity";
import { RegionService } from "./service/region.service";
import { RegionCodes } from "../survey/enums/region.enum";
import { RegionController } from "./controllers/region.controller";
import { VoteService } from "../survey/services/vote.service";
import { SurveyModule } from "../survey/survey.module";
import { UserModule } from "../user/user.module";

@Module({
    imports:[TypeOrmModule.forFeature([RegionEntity]),SurveyModule,UserModule],
    controllers:[RegionController],
    providers:[RegionService],
    exports:[RegionService]
})
export class RegionModule{}