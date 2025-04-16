import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1744796262025 implements MigrationInterface {
    name = 'Migration1744796262025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "channel_ids"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "clan_id"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "channels" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "channels"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "clan_id" character varying`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "channel_ids" character varying array`);
    }

}
