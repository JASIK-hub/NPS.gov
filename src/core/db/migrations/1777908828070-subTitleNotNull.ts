import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubTitleNotNull1777908828070 implements MigrationInterface {
  name = 'SubTitleNotNull1777908828070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "survey" SET "subTitle" = '' WHERE "subTitle" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "survey" ALTER COLUMN "subTitle" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey" ALTER COLUMN "subTitle" DROP NOT NULL`,
    );
  }
}
