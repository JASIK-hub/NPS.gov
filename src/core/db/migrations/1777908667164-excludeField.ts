import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExcludeField1777908667164 implements MigrationInterface {
  name = 'ExcludeField1777908667164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "certificateThumbprint"`,
    );
    await queryRunner.query(`ALTER TABLE "survey" ADD "subTitle" text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "subTitle"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "certificateThumbprint" text`,
    );
  }
}
