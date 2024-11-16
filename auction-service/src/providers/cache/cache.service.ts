import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import type Redis from "ioredis";

@Injectable()
export class CacheService {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	async get<T>(key: string): Promise<T> | null {
		const retrived = await this.redis.get(key);

		if (retrived.length <= 0) return null;

		const parsed: T = JSON.parse(retrived);
		return parsed;
	}

	async set<T>(key: string, value: T): Promise<boolean> {
		try {
			const stringified = JSON.stringify(value);
			await this.redis.set(key, stringified);
			return true;
		} catch {
			return false;
		}
	}
}
