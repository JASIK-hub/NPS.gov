import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1776773679314 implements MigrationInterface {
    name = 'Init1776773679314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "iin" character varying(12), "firstName" character varying, "lastName" character varying, "middleName" character varying, "birthday" date, "gender" "public"."user_gender_enum", "password" text, "phone" character varying, "email" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "certificateThumbprint" text, CONSTRAINT "UQ_40e6cbd92bd7f1e31f3eae940b9" UNIQUE ("iin"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    }

}
