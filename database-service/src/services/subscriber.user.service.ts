import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { DatabaseException } from "src/exceptions/DatabaseException.dto";
import { UserRepository } from "src/repository/user.repository";

@Injectable()
export class SubscriberUserService {
	constructor(private readonly userRepository: UserRepository) {}

	async createDemoUser(addr: string): Promise<User> {
		return await this.userRepository.create("Jay Lim", addr);
	}

	async getUserAddress(id: string): Promise<string> {
		try {
			const user = await this.userRepository.findById(id);
			return user.address;
		} catch (e) {
			throw new DatabaseException("ERROR: Get User Address");
		}
	}

	async getUserByAddress(addr: string): Promise<User> {
		try {
			const user = await this.userRepository.findByAddress(addr);
			return user;
		} catch (e) {
			throw new DatabaseException("ERROR: Get User Address");
		}
	}
}
