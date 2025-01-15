import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateCacheOptions } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync<CreateCacheOptions>({
      useFactory: async (configService: ConfigService) =>
        ({
          store: await redisStore({
            url: configService.getOrThrow('REDIS_URL'),
          }),
        }) as CreateCacheOptions,
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
