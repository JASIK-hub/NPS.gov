import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableEmail1778505853946 implements MigrationInterface {
    name = 'NullableEmail1778505853946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);
    }

}
