import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Auction } from "src/entities/auction.entity";
import { DatabaseException } from "src/exceptions/DatabaseException.dto";

@Injectable()
export class AuctionRepository {
	constructor(private readonly _em: EntityManager) {}

	async create(
		productId: string,
		auctionTitle: string,
		minimalPrice: string,
	): Promise<Auction> {
		try {
			const em = this._em.fork();

			const productRef = em.getReference("Product", productId);

			const newAuction = em.create(Auction, {
				product: productRef,
				isTerminated: false,
				minPrice: minimalPrice,
				title: auctionTitle,
			});

			await em.persistAndFlush(newAuction);

			return newAuction;
		} catch (e) {
			throw new DatabaseException(JSON.stringify(e));
		}
	}
}
