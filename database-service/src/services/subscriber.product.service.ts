import { Injectable } from "@nestjs/common";
import { ProductRepository } from "src/repository/product.repository";

@Injectable()
export class SubscriberProductService {
	constructor(private readonly productRepository: ProductRepository) {}

	async createNewProduct(
		ownerId: string,
		name: string,
		type: string,
	): Promise<string | null> {
		try {
			const product = await this.productRepository.create(ownerId, name, type);
			return product.id;
		} catch {
			//* DB Creation Error
			return null;
		}
	}
}
