import { MigrationInterface, QueryRunner } from 'typeorm';

export class SurveyRegion1776883202558 implements MigrationInterface {
  name = 'SurveyRegion1776883202558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."region_code_enum" AS ENUM('AST', 'ALM', 'SHM', 'AKT', 'KAR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "region" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" "public"."region_code_enum" NOT NULL, CONSTRAINT "UQ_8d766fc1d4d2e72ecd5f6567a02" UNIQUE ("name"), CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "survey" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" text NOT NULL, "votedCount" integer NOT NULL DEFAULT '0', "validUntil" date NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "organization_id" integer, "region_id" integer, CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD CONSTRAINT "FK_51124fdaa8350196ac22d109697" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD CONSTRAINT "FK_93726e1b8d5d8f2e9c95ffe55e8" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey" DROP CONSTRAINT "FK_93726e1b8d5d8f2e9c95ffe55e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey" DROP CONSTRAINT "FK_51124fdaa8350196ac22d109697"`,
    );
    await queryRunner.query(`DROP TABLE "survey"`);
    await queryRunner.query(`DROP TABLE "region"`);
    await queryRunner.query(`DROP TYPE "public"."region_code_enum"`);
  }
}
