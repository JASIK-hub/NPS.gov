import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "src/core/decorators/public.decorator";
import { RegionService } from "src/modules/region/service/region.service";

@ApiTags('Region')
@Controller('region')
export class RegionController {
    constructor(private regionService:RegionService){}
    
    @Public()
    @Get('statistic/survey')
    @ApiOperation({summary:'Gets statistics for regions with finished surveys'})
    async getRegionFinishedStats(){
        return this.regionService.getRegionsWithStats()
    }

    @Public()
    @Get('statistic/user')
    @ApiOperation({summary:'Gets region user stats'})
    async getRegionUserStats(){
        return this.regionService.getRegionsUserStats()
    }

}