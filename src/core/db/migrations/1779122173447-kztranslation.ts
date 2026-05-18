import { MigrationInterface, QueryRunner } from "typeorm";

export class Kztranslation1779122173447 implements MigrationInterface {
    name = 'Kztranslation1779122173447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "survey_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "nameKz" character varying NOT NULL, CONSTRAINT "UQ_581041d33b37e15b586def8a2d2" UNIQUE ("name"), CONSTRAINT "PK_4008aa53f3435e26c3b162d3c2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."survey_type_enum"`);
        await queryRunner.query(`ALTER TABLE "region" ADD "nameKz" character varying NULL`);
        await queryRunner.query(`ALTER TABLE "region" ADD CONSTRAINT "UQ_9c276cc489fa3d09331ca714d73" UNIQUE ("nameKz")`);
        await queryRunner.query(`ALTER TABLE "option" ADD "titleKz" character varying`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "titleKz" character varying`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "descriptionKz" text`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "subTitleKz" text`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "type_id" integer`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_4008aa53f3435e26c3b162d3c2d" FOREIGN KEY ("type_id") REFERENCES "survey_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_4008aa53f3435e26c3b162d3c2d"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "subTitleKz"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "descriptionKz"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "titleKz"`);
        await queryRunner.query(`ALTER TABLE "option" DROP COLUMN "titleKz"`);
        await queryRunner.query(`ALTER TABLE "region" DROP CONSTRAINT "UQ_9c276cc489fa3d09331ca714d73"`);
        await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "nameKz"`);
        await queryRunner.query(`CREATE TYPE "public"."survey_type_enum" AS ENUM('INFRASTRUCTURE', 'HEALTHCARE', 'DIGITALIZATION', 'ECONOMY', 'ECOLOGY', 'EDUCATION')`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "type" "public"."survey_type_enum" NOT NULL`);
        await queryRunner.query(`DROP TABLE "survey_type"`);
    }

}
