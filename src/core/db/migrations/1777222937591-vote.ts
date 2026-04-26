import { MigrationInterface, QueryRunner } from "typeorm";

export class Vote1777222937591 implements MigrationInterface {
    name = 'Vote1777222937591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "option" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "surveyId" integer, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vote" ("id" SERIAL NOT NULL, "userId" integer, "surveyId" integer, "optionId" integer, CONSTRAINT "PK_2d5932d46afe39c8176f9d4be72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."survey_type_enum" AS ENUM('INFRASTRUCTURE', 'HEALTHCARE', 'DIGITALIZATION', 'ECONOMY', 'ECOLOGY', 'EDUCATION')`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "type" "public"."survey_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "startDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "option" ADD CONSTRAINT "FK_4ed858a33ada3cc6b76928dac21" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_9edacb7193fe5e669d648b6dc9d" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_4ae2eb8e398ff87416da92ea286" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_4ae2eb8e398ff87416da92ea286"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_9edacb7193fe5e669d648b6dc9d"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`);
        await queryRunner.query(`ALTER TABLE "option" DROP CONSTRAINT "FK_4ed858a33ada3cc6b76928dac21"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."survey_type_enum"`);
        await queryRunner.query(`DROP TABLE "vote"`);
        await queryRunner.query(`DROP TABLE "option"`);
    }

}
