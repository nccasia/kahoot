import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomUser } from './entities/room-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomUser])],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
})
export class RoomModule {}
