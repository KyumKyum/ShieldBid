import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Product } from "src/entities/product.entity";
import { DatabaseException } from "src/exceptions/DatabaseException.dto";

@Injectable()
export class ProductRepository {
	constructor(private readonly _em: EntityManager) {}

	async create(ownerId: string, name: string, type: string, description: string): Promise<Product> {
		try {
			const em = this._em.fork();

			const ownerRef = em.getReference("User", ownerId);

			const newProduct = em.create(Product, {
				owner: ownerRef,
				name,
				type,
				description
			});

			await em.persistAndFlush(newProduct);

			return newProduct;
		} catch (e) {
			throw new DatabaseException(JSON.stringify(e));
		}
	}
}
