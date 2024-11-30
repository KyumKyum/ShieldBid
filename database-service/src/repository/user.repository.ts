import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";

@Injectable()
export class UserRepository {
	constructor(private readonly em: EntityManager) {}

	async create(name: string): Promise<User> {
		const newUser = new User();
		newUser.name = name;

		await this.em.persistAndFlush(newUser);

		return newUser;
	}
}
