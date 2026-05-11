import { SurveyType } from "src/modules/survey/enums/survey-type.enum";
import { DataSource } from "typeorm";
import { SurveyEntity } from "../entities/survey.entity";
import { OrganizationEntity } from "../entities/organization.entity";
import { RegionEntity } from "../entities/region.entity";
import { OptionEntity } from "../entities/option.entity";

export async function surveySeed(dataSource: DataSource) {
  const surveyRepo = dataSource.getRepository(SurveyEntity);
  const orgRepo = dataSource.getRepository(OrganizationEntity);
  const regionRepo = dataSource.getRepository(RegionEntity);
  const optionRepo = dataSource.getRepository(OptionEntity);

  let org = await orgRepo.findOneBy({ bin: '123456789012' });
  if (!org) {
    org = orgRepo.create({ bin: '123456789012', name: 'Департамент развития' });
    await orgRepo.save(org);
  }

  const allRegions = await regionRepo.find();

  const defaultSurveys = [
    {
      title: 'Качество государственных услуг',
      description: 'Оцените уровень удовлетворенности получением справок в ЦОН.',
      subTitle: 'Мониторинг госуслуг',
      type: SurveyType.ECONOMY,
      startDate: '2026-05-01',
      validUntil: new Date('2026-12-31'),
      options: ['Отлично', 'Средне', 'Плохо'],
    },
    {
      title: 'Чистота города',
      description: 'Насколько вы довольны работой коммунальных служб?',
      subTitle: 'Экологический мониторинг',
      type: SurveyType.ECOLOGY,
      startDate: '2026-05-10',
      validUntil: new Date('2026-08-30'),
      options: ['Очень чисто', 'Нужна уборка', 'Грязно'],
    },
    {
      title: 'Доступность медицины',
      description: 'Опрос о качестве обслуживания в поликлиниках.',
      subTitle: 'Здравоохранение',
      type: SurveyType.ECONOMY,
      startDate: '2026-05-15',
      validUntil: new Date('2026-11-20'),
      options: ['Легко записаться', 'Трудно попасть к врачу'],
    },
    {
      title: 'Состояние дорог',
      description: 'Оцените качество дорожного полотна в вашем районе.',
      subTitle: 'Инфраструктура',
      type: SurveyType.ECONOMY,
      startDate: '2026-04-01',
      validUntil: new Date('2026-09-01'),
      options: ['Хорошее', 'Много ям', 'Ужасное'],
    },
    {
      title: 'Общественный транспорт',
      description: 'Соблюдаются ли графики движения автобусов?',
      subTitle: 'Транспортная логистика',
      type: SurveyType.ECONOMY,
      startDate: '2026-05-01',
      validUntil: new Date('2026-12-31'),
      options: ['Всегда вовремя', 'Часто опаздывают'],
    },
    {
      title: 'Озеленение парков',
      description: 'Достаточно ли зеленых насаждений в общественных местах?',
      subTitle: 'Благоустройство',
      type: SurveyType.ECOLOGY,
      startDate: '2026-03-20',
      validUntil: new Date('2026-07-20'),
      options: ['Да, много деревьев', 'Нужно больше'],
    },
    {
      title: 'Безопасность дворов',
      description: 'Достаточно ли освещения в вечернее время?',
      subTitle: 'Городская среда',
      type: SurveyType.ECONOMY,
      startDate: '2026-05-05',
      validUntil: new Date('2026-10-15'),
      options: ['Светло и безопасно', 'Темно и страшно'],
    },
    {
      title: 'Цифровые сервисы',
      description: 'Пользуетесь ли вы приложением eGov Mobile?',
      subTitle: 'Digital Kazakhstan',
      type: SurveyType.ECONOMY,
      startDate: '2026-01-01',
      validUntil: new Date('2027-01-01'),
      options: ['Постоянно', 'Редко', 'Не пользуюсь'],
    },
  ];

  const existingCount = await surveyRepo.count();
  if (existingCount >= 8) {
    console.log('Seed: Surveys already exist, skipping...');
    return;
  }

  for (const data of defaultSurveys) {
    const { options, ...surveyData } = data;

    const survey = surveyRepo.create({
      ...surveyData,
      organization: org,
      region: allRegions.length > 0 
        ? allRegions[Math.floor(Math.random() * allRegions.length)] 
        : null,
      isActive: true,
      votedCount: 0,
    });

    const savedSurvey = await surveyRepo.save(survey);

    for (const optTitle of options) {
      await optionRepo.save(
        optionRepo.create({
          title: optTitle,
          survey: savedSurvey,
        }),
      );
    }
  }

  console.log('Seed: 8 surveys with options created successfully.');
}