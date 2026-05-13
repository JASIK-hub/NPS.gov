import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedAtVote1778678780560 implements MigrationInterface {
    name = 'CreatedAtVote1778678780560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "createdAt"`);
    }

}
