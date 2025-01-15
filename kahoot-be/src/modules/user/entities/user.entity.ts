import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Game } from '@modules/game/entities/game.entity';
import { ApiProperty } from '@nestjs/swagger';

@Index(['email'], { unique: true })
@Entity(Table.User)
export class User extends AbstractEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ unique: true })
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  image: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Column()
  email: string;

  // relations
  @OneToMany(() => Game, (game) => game.owner)
  games: Game[];
}
