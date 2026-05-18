export class LocalizeMapper {
  private static localizedField(value: string, valueKz: string | null, lang: string): string {
    return lang === 'kz' && valueKz ? valueKz : value;
  }

  static mapSurveyTo(survey: any, language: string = 'ru') {
    return {
      ...survey,
      title: this.localizedField(survey.title, survey.titleKz, language),
      description: this.localizedField(survey.description, survey.descriptionKz, language),
      subTitle: this.localizedField(survey.subTitle, survey.subTitleKz, language),
      type: survey.type
        ? {
            id: survey.type.id,
            name: survey.type.name,
            nameKz: survey.type.nameKz,
            nameRu: survey.type.nameRu,
          }
        : null,
      options: survey.options?.map(opt => ({
        ...opt,
        title: this.localizedField(opt.title, opt.titleKz, language),
      })) || [],
    };
  }

  static mapSurveyType(type: any, language: string = 'ru') {
    return {
      id: type.id,
      name: type.name,
      nameKz: type.nameKz,
      nameRu: type.nameRu,
    };
  }

  static mapSurveyTypes(types: any[], language: string = 'ru') {
    return types.map(type => this.mapSurveyType(type, language));
  }

  static mapSurveyTypeStats(stats: any[], language: string = 'ru') {
    return stats.map(stat => ({
      type: language === 'kz' ? stat.nameKz : stat.nameRu,
      count: parseInt(stat.count)
    }));
  }
}
