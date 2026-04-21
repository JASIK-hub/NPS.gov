import { MigrationInterface, QueryRunner } from "typeorm";

export class Organization1776777756140 implements MigrationInterface {
    name = 'Organization1776777756140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "bin" character varying(12) NOT NULL, "name" character varying, CONSTRAINT "UQ_dbaffe0c6882bacf0e291d429d3" UNIQUE ("bin"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organization_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3e103cdf85b7d6cb620b4db0f0c" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3e103cdf85b7d6cb620b4db0f0c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organization_id"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
