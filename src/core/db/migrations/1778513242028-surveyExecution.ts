import { MigrationInterface, QueryRunner } from "typeorm";

export class SurveyExecution1778513242028 implements MigrationInterface {
    name = 'SurveyExecution1778513242028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."survey_executionstatus_enum" AS ENUM('implemented', 'in progress', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "executionStatus" "public"."survey_executionstatus_enum" NOT NULL DEFAULT 'in progress'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "executionStatus"`);
        await queryRunner.query(`DROP TYPE "public"."survey_executionstatus_enum"`);
    }

}
