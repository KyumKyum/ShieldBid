import { Body, Controller, Inject, Put } from "@nestjs/common";
import type { CacheAuction } from "src/dto/CacheAuction.dto";
import type { CreateAuctionRequest } from "src/dto/CreateAuctionRequest.dto";
import { CacheService } from "src/providers/cache/cache.service";
import { ProductService } from "src/services/product.service";
import { v4 } from "uuid";

@Controller("auction")
export class AuctionController {
	constructor(
		@Inject(ProductService) private readonly productService: ProductService,
		@Inject(CacheService) private readonly cacheService: CacheService,
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
}
