import { DataSource } from "typeorm";
import { SurveyEntity } from "../entities/survey.entity";
import { SurveyTypeEntity } from "../entities/survey-type.entity";
import { OrganizationEntity } from "../entities/organization.entity";
import { RegionEntity } from "../entities/region.entity";
import { OptionEntity } from "../entities/option.entity";

export async function surveySeed(dataSource: DataSource) {
  const surveyRepo = dataSource.getRepository(SurveyEntity);
  const surveyTypeRepo = dataSource.getRepository(SurveyTypeEntity);
  const orgRepo = dataSource.getRepository(OrganizationEntity);
  const regionRepo = dataSource.getRepository(RegionEntity);
  const optionRepo = dataSource.getRepository(OptionEntity);

  let org = await orgRepo.findOneBy({ bin: '123456789012' });
  if (!org) {
    org = orgRepo.create({ bin: '123456789012', name: 'Департамент развития' });
    await orgRepo.save(org);
  }

  const allRegions = await regionRepo.find();

  let economyType = await surveyTypeRepo.findOneBy({ name: 'ECONOMY' });
  if (!economyType) {
    economyType = surveyTypeRepo.create({ name: 'ECONOMY', nameKz: 'Экономика' });
    await surveyTypeRepo.save(economyType);
  }

  let ecologyType = await surveyTypeRepo.findOneBy({ name: 'ECOLOGY' });
  if (!ecologyType) {
    ecologyType = surveyTypeRepo.create({ name: 'ECOLOGY', nameKz: 'Экология' });
    await surveyTypeRepo.save(ecologyType);
  }

  const defaultSurveys = [
    {
      title: 'Качество государственных услуг',
      description: 'Оцените уровень удовлетворенности получением справок в ЦОН.',
      subTitle: 'Мониторинг госуслуг',
      titleKz: 'Мемлекеттік қызметтер сапасы',
      descriptionKz: 'ЦОН-нан анықтама алу қанағаттылығын бағалаңыз.',
      subTitleKz: 'Мемлекеттік қызметтерді мониторингілеу',
      type: economyType,
      startDate: '2026-05-01',
      validUntil: new Date('2026-12-31'),
      options: ['Отлично', 'Средне', 'Плохо'],
      optionsKz: ['Тамаша', 'Орташа', 'Нашар'],
    },
    {
      title: 'Чистота города',
      description: 'Насколько вы довольны работой коммунальных служб?',
      subTitle: 'Экологический мониторинг',
      titleKz: 'Қаланың тазалығы',
      descriptionKz: 'Коммуналдық қызметтердің жұмысымен қаншалықты қанағатсыз?',
      subTitleKz: 'Экологиялық мониторинг',
      type: ecologyType,
      startDate: '2026-05-10',
      validUntil: new Date('2026-08-30'),
      options: ['Очень чисто', 'Нужна уборка', 'Грязно'],
      optionsKz: ['Өте таза', 'Жинау керек', 'Лас'],
    },
    {
      title: 'Доступность медицины',
      description: 'Опрос о качестве обслуживания в поликлиниках.',
      subTitle: 'Здравоохранение',
      titleKz: 'Дәрігерлік көмектің қол жетімділігі',
      descriptionKz: 'Поликлиникалардағы қызмет сапасы туралы сауалнама.',
      subTitleKz: 'Денсаулық сақтау',
      type: economyType,
      startDate: '2026-05-15',
      validUntil: new Date('2026-11-20'),
      options: ['Легко записаться', 'Трудно попасть к врачу'],
      optionsKz: ['Оңай жаздыруға болады', 'Дәрігерге түсу қиын'],
    },
    {
      title: 'Состояние дорог',
      description: 'Оцените качество дорожного полотна в вашем районе.',
      subTitle: 'Инфраструктура',
      titleKz: 'Жолдардың жағдайы',
      descriptionKz: 'Аймағыңыздағы жол төсеніннің сапасын бағалаңыз.',
      subTitleKz: 'Инфрақұрылым',
      type: economyType,
      startDate: '2026-04-01',
      validUntil: new Date('2026-09-01'),
      options: ['Хорошее', 'Много ям', 'Ужасное'],
      optionsKz: ['Жақсы', 'Көп шұңған', 'Нашар'],
    },
    {
      title: 'Общественный транспорт',
      description: 'Соблюдаются ли графики движения автобусов?',
      subTitle: 'Транспортная логистика',
      titleKz: 'Қоғамдық көлік',
      descriptionKz: 'Автобустардың қатынау кестесі сақталады ма?',
      subTitleKz: 'Көлік логистикасы',
      type: economyType,
      startDate: '2026-05-01',
      validUntil: new Date('2026-12-31'),
      options: ['Всегда вовремя', 'Часто опаздывают'],
      optionsKz: ['Әрқашанда уақыттылы', 'Жиі кешігеді'],
    },
    {
      title: 'Озеленение парков',
      description: 'Достаточно ли зеленых насаждений в общественных местах?',
      subTitle: 'Благоустройство',
      titleKz: 'Саябақтарды көгалдандыру',
      descriptionKz: 'Қоғамдық орындарда жасыл өсімдіктер жеткілікті ме?',
      subTitleKz: 'Жақсарту',
      type: ecologyType,
      startDate: '2026-03-20',
      validUntil: new Date('2026-07-20'),
      options: ['Да, много деревьев', 'Нужно больше'],
      optionsKz: ['Иә, көп ағаштар бар', 'Көбірек керек'],
    },
    {
      title: 'Безопасность дворов',
      description: 'Достаточно ли освещения в вечернее время?',
      subTitle: 'Городская среда',
      titleKz: 'аулалардың қауіпсіздігі',
      descriptionKz: 'Кешкі уақытта жарықтық жеткілікті ме?',
      subTitleKz: 'Қала ортасы',
      type: economyType,
      startDate: '2026-05-05',
      validUntil: new Date('2026-10-15'),
      options: ['Светло и безопасно', 'Темно и страшно'],
      optionsKz: ['Жарық және қауіпсіз', 'Қараңғы және қорқынышты'],
    },
    {
      title: 'Цифровые сервисы',
      description: 'Пользуетесь ли вы приложением eGov Mobile?',
      subTitle: 'Digital Kazakhstan',
      titleKz: 'Цифрлық қызметтер',
      descriptionKz: 'eGov Mobile қолданбасын пайдаланасыз ба?',
      subTitleKz: 'Digital Kazakhstan',
      type: economyType,
      startDate: '2026-01-01',
      validUntil: new Date('2027-01-01'),
      options: ['Постоянно', 'Редко', 'Не пользуюсь'],
      optionsKz: ['Үнемі', 'Сирек', 'Пайдаланамын'],
    },
  ];

  const existingCount = await surveyRepo.count();
  if (existingCount >= 8) {
    console.log('Seed: Surveys already exist, skipping...');
    return;
  }

  for (const data of defaultSurveys) {
    const { options, optionsKz, ...surveyData } = data;

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

    for (let i = 0; i < options.length; i++) {
      await optionRepo.save(
        optionRepo.create({
          title: options[i],
          titleKz: optionsKz?.[i],
          survey: savedSurvey,
        }),
      );
    }
  }

  console.log('Seed: 8 surveys with options created successfully.');
}