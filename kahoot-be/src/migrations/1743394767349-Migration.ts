import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743394767349 implements MigrationInterface {
    name = 'Migration1743394767349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "image"`);
    }

}
