import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1744796262025 implements MigrationInterface {
    name = 'Migration1744796262025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "channel_id" character varying`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "channels" json`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "text_message" text`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "channel_ids"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "channels"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "channel_id"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "text_message"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "channel_ids" character varying array`);
    }

}
