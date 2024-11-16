import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Product } from "src/entities/product.entity";
import { DatabaseException } from "src/exceptions/DatabaseException.dto";

@Injectable()
export class ProductRepository {
	constructor(private readonly em: EntityManager) {}

	async create(ownerId: string, name: string, type: string): Promise<Product> {
		try {
			const emFork = this.em.fork();

			const ownerRef = emFork.getReference("User", ownerId);
			console.log(JSON.stringify(ownerRef));
			const newProduct = emFork.create(Product, {
				owner: ownerRef,
				name,
				type,
			});

			console.log(JSON.stringify(newProduct));

			await emFork.persistAndFlush(newProduct);

			return newProduct;
		} catch (e) {
			throw new DatabaseException(JSON.stringify(e));
		}
	}
}
