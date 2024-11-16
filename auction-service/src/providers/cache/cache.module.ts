import { Global, Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { RedisConfigModule } from "./redis.module";

@Global()
@Module({
	imports: [RedisConfigModule],
	providers: [CacheService],
	exports: [CacheService],
})
export class CacheModule {}
