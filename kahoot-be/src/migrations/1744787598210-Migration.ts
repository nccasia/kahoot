import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1744787598210 implements MigrationInterface {
    name = 'Migration1744787598210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "is_notify_enabled" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "is_notify_enabled"`);
    }

}
