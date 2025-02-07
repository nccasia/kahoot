import { User } from '@modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomUser } from './entities/room-user.entity';
import { Room } from './entities/room.entity';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room, RoomUser])],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
})
export class RoomModule {}
