import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743521528276 implements MigrationInterface {
    name = 'Migration1743521528276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_room_users" ADD "answer_text" character varying`);
        await queryRunner.query(`ALTER TABLE "question_room_users" ADD "answer_indexs" integer array`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "answer_text" character varying`);
        await queryRunner.query(`ALTER TABLE "question_room_users" ALTER COLUMN "answer_index" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "answer_options" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "answer_options" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_room_users" ALTER COLUMN "answer_index" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "answer_text"`);
        await queryRunner.query(`ALTER TABLE "question_room_users" DROP COLUMN "answer_indexs"`);
        await queryRunner.query(`ALTER TABLE "question_room_users" DROP COLUMN "answer_text"`);
    }

}
