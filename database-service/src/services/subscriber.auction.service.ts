import { Injectable } from "@nestjs/common";
import { AuctionRepository } from "src/repository/auction.repository";

@Injectable()
export class SubscriberAuctionService {
	constructor(private readonly auctionRepository: AuctionRepository) {}

	async createNewAuction(
		productId: string,
		auctionTitle: string,
		minimalPrice: string,
	): Promise<string | null> {
		try {
			const auction = await this.auctionRepository.create(
				productId,
				auctionTitle,
				minimalPrice,
			);

			return auction.id;
		} catch {
			return null;
		}
	}
}
