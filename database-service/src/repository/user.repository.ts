import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";

@Injectable()
export class UserRepository {
	constructor(private readonly _em: EntityManager) {}

	async create(name: string, addr: string): Promise<User> {
		const newUser = new User();
		newUser.name = name;
		newUser.address = addr;

		console.log(newUser)

		const em = this._em.fork();

		await em.persistAndFlush(newUser);

		return newUser;
	}

	async findById(id: string): Promise<User | null> {
		const em = this._em.fork();
		const user = await em.findOne(User, { id });
		return user;
	}

	async findByAddress(addr: string): Promise<User | null> {
		const em = this._em.fork();
		const user = await em.findOne(User, { address: addr });
		return user;
	}

	async updateConsignor(userId: string) {
		const em = this._em.fork();
		const user = await em.findOne(User, {id: userId});
		user.isConsignor = true;
		user.updatedAt = new Date()

		await em.persistAndFlush(user);
	}
}
