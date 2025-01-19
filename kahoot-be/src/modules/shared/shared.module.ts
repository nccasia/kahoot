import { RedisCacheModule } from '@base/modules/cache/redis.cache.module';
import { Global, Module } from '@nestjs/common';
@Global()
@Module({
  imports: [RedisCacheModule],
  controllers: [],
  providers: [],
  exports: [RedisCacheModule],
})
export class SharedModule {}
