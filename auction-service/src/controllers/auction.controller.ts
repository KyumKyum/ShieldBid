import { Body, Controller, Inject, Post, Put } from "@nestjs/common";
import {
	CacheAuction,
	CreateAuctionRequest,
	FinishAuctionRequest,
} from "src/dto/auction.dto";
import { CacheService } from "src/providers/cache/cache.service";
import { AuctionService } from "src/services/auction.service";
import { ProductService } from "src/services/product.service";
import { v4 } from "uuid";

@Controller("auction")
export class RootController {
	constructor(
		private readonly productService: ProductService,
		private readonly cacheService: CacheService,
		private readonly auctionService: AuctionService,
	) {}

	@Put()
	async createAuction(@Body() createAuctionReq: CreateAuctionRequest) {
		const { productName, productType, minimalPrice, ownerId, auctionTitle } =
			createAuctionReq;

		const cacheAuction: CacheAuction = {
			auctionTitle:
				auctionTitle?.length > 0 ? auctionTitle : `Auction: ${productName}`,
			minimalPrice,
		};

		const cacheAuctionKey = `CACHEAUCTION_${v4()}`;

		await this.cacheService.set(cacheAuctionKey, cacheAuction);

		await this.productService.publishCreateProductEvent(
			cacheAuctionKey,
			productName,
			productType,
			ownerId,
		);

		return; //Test
	}

	//* Finish auction
	@Post("finish")
	async finishAuction(@Body() finishAuctionReq: FinishAuctionRequest) {
		const { auctionId } = finishAuctionReq;
		await this.auctionService.requestAuctionTermination(auctionId);
	}
}
