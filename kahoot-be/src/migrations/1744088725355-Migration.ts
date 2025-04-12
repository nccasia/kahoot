import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1744088725355 implements MigrationInterface {
    name = 'Migration1744088725355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "scheduled_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "channel_ids" character varying array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "channel_ids"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "scheduled_at"`);
    }

}
