import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1744164875511 implements MigrationInterface {
    name = 'Migration1744164875511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "clan_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "clan_id"`);
    }

}
