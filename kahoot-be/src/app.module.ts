import { ConfigAppModule } from '@base/modules/configs/config-app.module';
import { DatabaseModule } from '@base/modules/database/database.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [ConfigAppModule, DatabaseModule, PassportModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
