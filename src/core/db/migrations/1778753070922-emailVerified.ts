import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailVerified1778753070922 implements MigrationInterface {
    name = 'EmailVerified1778753070922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerified" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerified"`);
    }

}
