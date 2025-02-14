import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { User } from '@modules/user/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Room } from './room.entity';

@Entity(Table.RoomUser)
@Index(['room', 'user'], { unique: true })
export class RoomUser extends AbstractEntity {
  @Column({ nullable: false, name: 'user_id' })
  userId: string;

  @Column({ nullable: false, default: false })
  isOwner: boolean;

  @Column({ nullable: false, name: 'room_id' })
  roomId: string;

  // relations
  @ManyToOne(() => User, (user) => user.roomUsers, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.roomUsers, { nullable: false })
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
