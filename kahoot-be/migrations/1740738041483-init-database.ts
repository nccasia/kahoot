import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1740738041483 implements MigrationInterface {
    name = 'InitDatabase1740738041483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "room_id" uuid NOT NULL, "question_id" uuid NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_7b29bdf40cef68e7a8a999613c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1e1cbfa069eae2b69028916925" ON "room_questions" ("room_id", "question_id") `);
        await queryRunner.query(`CREATE TABLE "room_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "is_owner" boolean NOT NULL DEFAULT false, "is_leave" boolean DEFAULT false, "room_id" uuid NOT NULL, CONSTRAINT "PK_6ba6f5ed6505258587bcf0e8db6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ba0fd8c93a7d079c1ebe5db4e1" ON "room_users" ("room_id", "user_id") `);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "status" character varying NOT NULL, "code" character varying NOT NULL, "owner_id" uuid NOT NULL, "game_id" uuid NOT NULL, CONSTRAINT "UQ_368d83b661b9670e7be1bbb9cdd" UNIQUE ("code"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_room_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "room_id" uuid NOT NULL, "question_id" uuid NOT NULL, "answer_index" integer NOT NULL, "is_correct" boolean NOT NULL, "point" integer, "submitted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, CONSTRAINT "PK_e6020f7d9d8e90a062816884f41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_291a72a8b7fbb78075845432f3" ON "question_room_users" ("room_id", "user_id", "question_id") `);
        await queryRunner.query(`CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "mode" character varying NOT NULL, "time" integer NOT NULL, "title" character varying NOT NULL, "answer_options" json NOT NULL, "owner_id" uuid NOT NULL, "game_id" uuid NOT NULL, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "description" character varying NOT NULL, "owner_id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "mezon_user_id" character varying NOT NULL, "user_name" character varying NOT NULL, "avatar" character varying, "email" character varying NOT NULL, CONSTRAINT "UQ_93fed282a4b789488e6a76ff5d4" UNIQUE ("mezon_user_id"), CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "room_questions" ADD CONSTRAINT "FK_afc3b9eccc6c079f6da4bffc96a" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_questions" ADD CONSTRAINT "FK_1c2ed335796355e6e5e431585ba" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_users" ADD CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_users" ADD CONSTRAINT "FK_443c187b06edbc18738b24aac34" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_9f38c339cb7a6e33b02f9d2c743" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_0aa395c687bc4e405653f3710fb" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_room_users" ADD CONSTRAINT "FK_2e3d69b51470150c7e773ead03c" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_room_users" ADD CONSTRAINT "FK_712fc6987f14a3a1a751fe400d1" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_room_users" ADD CONSTRAINT "FK_4f67952764d682943962f4665e5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_996c419e80f925ac7c718bd7fcf" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_2fd6ddf4cb199ba01ee26ec1eb6" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_947813e7527e8cde22542e33d36" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_947813e7527e8cde22542e33d36"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_2fd6ddf4cb199ba01ee26ec1eb6"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_996c419e80f925ac7c718bd7fcf"`);
        await queryRunner.query(`ALTER TABLE "question_room_users" DROP CONSTRAINT "FK_4f67952764d682943962f4665e5"`);
        await queryRunner.query(`ALTER TABLE "question_room_users" DROP CONSTRAINT "FK_712fc6987f14a3a1a751fe400d1"`);
        await queryRunner.query(`ALTER TABLE "question_room_users" DROP CONSTRAINT "FK_2e3d69b51470150c7e773ead03c"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_0aa395c687bc4e405653f3710fb"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_9f38c339cb7a6e33b02f9d2c743"`);
        await queryRunner.query(`ALTER TABLE "room_users" DROP CONSTRAINT "FK_443c187b06edbc18738b24aac34"`);
        await queryRunner.query(`ALTER TABLE "room_users" DROP CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89"`);
        await queryRunner.query(`ALTER TABLE "room_questions" DROP CONSTRAINT "FK_1c2ed335796355e6e5e431585ba"`);
        await queryRunner.query(`ALTER TABLE "room_questions" DROP CONSTRAINT "FK_afc3b9eccc6c079f6da4bffc96a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_291a72a8b7fbb78075845432f3"`);
        await queryRunner.query(`DROP TABLE "question_room_users"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba0fd8c93a7d079c1ebe5db4e1"`);
        await queryRunner.query(`DROP TABLE "room_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1e1cbfa069eae2b69028916925"`);
        await queryRunner.query(`DROP TABLE "room_questions"`);
    }

}
