import { DataSource } from 'typeorm';
import { RegionEntity } from '../entities/region.entity';
import { RegionCodes } from 'src/modules/survey/enums/region.enum';

export const regionsSeed = async (dataSource: DataSource) => {
  const regionRepo = dataSource.getRepository(RegionEntity);
  for (const region of Object.values(RegionCodes)) {
    const existing = await regionRepo.findOne({ where: { code: region } });
    if (!existing) {
      const regionBody = regionRepo.create({
        name: mapRegionCode(region),
        code: region,
      });
      await regionRepo.save(regionBody);
    }
  }
};

function mapRegionCode(region: RegionCodes) {
  const regionMap: Record<RegionCodes, string> = {
    [RegionCodes.ALM]: 'Алматы',
    [RegionCodes.AKT]: 'Актобе',
    [RegionCodes.SHM]: 'Шымкент',
    [RegionCodes.AST]: 'Астана',
    [RegionCodes.KAR]: 'Караганда',
  };
  return regionMap[region];
}
