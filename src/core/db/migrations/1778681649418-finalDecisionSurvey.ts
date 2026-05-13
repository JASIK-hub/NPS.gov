import { MigrationInterface, QueryRunner } from "typeorm";

export class FinalDecisionSurvey1778681649418 implements MigrationInterface {
    name = 'FinalDecisionSurvey1778681649418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" ADD "finalDecision" text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "finalDecision"`);
    }

}
