import { Body, Controller, Get, Inject, Param, Post, Put } from "@nestjs/common";
import {
	AuctionDto,
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
		const { productName, productType, minimalPrice, ownerId, auctionTitle, productDescription } =
			createAuctionReq;

		const cacheAuction: CacheAuction = {
			auctionTitle:
				auctionTitle?.length > 0 ? auctionTitle : `Auction: ${productName}`,
			minimalPrice,
			ownerId,
		};

		const cacheAuctionKey = `CACHEAUCTION_${v4()}`;

		await this.cacheService.set(cacheAuctionKey, cacheAuction);

		await this.productService.publishCreateProductEvent(
			cacheAuctionKey,
			productName,
			productType,
			ownerId,
			productDescription
		);

		return; //Test(
	}

	// * List auction
	@Get("/lists")
	async getAuctionList(): Promise<AuctionDto[]> {
		return await this.auctionService.queryAuctionList();
		
	}

	@Get("/list:id")
	async getAuction(@Param("id") id: string): Promise<AuctionDto> {
		const auctionId = id.substring(1)
		return await this.auctionService.queryAuction(auctionId);
		
	}

	//* Finish auction
	@Post("finish")
	async finishAuction(@Body() finishAuctionReq: FinishAuctionRequest) {
		const { auctionId } = finishAuctionReq;
		await this.auctionService.requestAuctionTermination(auctionId);
	}
}
