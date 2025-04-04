import { JwtStrategy } from '@base/passports/jwt.strategy';
import { Game } from '@modules/game/entities/game.entity';
import { Question } from '@modules/question/entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionRoomUser } from './entities/question-room-user.entity';
import { RoomQuestion } from './entities/room-question.entity';
import { RoomUser } from './entities/room-user.entity';
import { Room } from './entities/room.entity';
import { RoomCacheService } from './room-cache.service';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Room,
      RoomUser,
      QuestionRoomUser,
      Question,
      RoomQuestion,
      Game,
    ]),
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway, RoomCacheService, JwtStrategy],
})
export class RoomModule {}
