import { Injectable } from "@nestjs/common";
import { ProductRepository } from "src/repository/product.repository";

@Injectable()
export class SubscriberProductService {
	constructor(private readonly productRepository: ProductRepository) {}

	async createNewProduct(
		ownerId: string,
		name: string,
		type: string,
	): Promise<boolean> {
		try {
			console.log(ownerId);
			await this.productRepository.create(ownerId, name, type);
			return true;
		} catch {
			//* DB Creation Error
			return false;
		}
	}
}
