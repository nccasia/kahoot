import { Game } from '@modules/game/entities/game.entity';
import { Question } from '@modules/question/entities/question.entity';
import { QuestionRoomUser } from '@modules/room/entities/question-room-user.entity';
import { RoomQuestion } from '@modules/room/entities/room-question.entity';
import { RoomUser } from '@modules/room/entities/room-user.entity';
import { Room } from '@modules/room/entities/room.entity';
import { User } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow<string>('POSTGRES_HOST'),
      port: +this.configService.getOrThrow<string>('POSTGRES_PORT'),
      username: this.configService.getOrThrow<string>('POSTGRES_USER'),
      password: this.configService.getOrThrow<string>('POSTGRES_PASSWORD'),
      database: this.configService.getOrThrow<string>('POSTGRES_DATABASE'),
      synchronize: false,
      entities: [
        User,
        Game,
        Question,
        Room,
        RoomUser,
        RoomQuestion,
        QuestionRoomUser,
      ],
      namingStrategy: new SnakeNamingStrategy(),
      migrations: ['/migrations/**/*.ts'],
      logging: this.configService.get('NODE_ENV') !== 'production',
    };
  }
}
