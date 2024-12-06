import { Module } from "@nestjs/common";
import { RedisModule } from "@nestjs-modules/ioredis";

@Module({
	imports: [
		RedisModule.forRoot({
			type: "single",
			url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
		}),
	],
	exports: [RedisModule],
})
export class RedisConfigModule {}
